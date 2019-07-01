import {
    Component,
    forwardRef,
    ElementRef,
    EventEmitter,
    ChangeDetectorRef,
    ViewEncapsulation,
    Inject,
    Input,
    Output,
    Provider,
    Attribute,
    ViewChild,
    ChangeDetectionStrategy,
    SimpleChanges,
    SimpleChange
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent, ɵr as ConsoleService, SELECTION_MODEL_FACTORY, NgSelectConfig } from '@ng-select/ng-select';
import { SelectionModelFactory } from '@ng-select/ng-select/ng-select/selection-model';

import { AuthorizationLevel } from 'life-core/authorization';
import { ListItem } from 'life-core/model';
import { LangUtil } from 'life-core/util/lang';
import { ListUtil } from 'life-core/util';
import { ContainerSelector, SettableContainerComponent } from 'life-core/component/container';

import { FormInputAccessor } from '../shared/form-input.accessor';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from '../../authorization';
import { DropdownActionType } from './dropdown-action-type';
import { LfSelectConfig } from './lf-select.config';

export const SELECT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfSelect),
    multi: true
};

export const SELECT_HOST = {
    role: 'listbox',
    class: 'ng-select',
    '[class.ng-select-single]': '!multiple'
};

@Component({
    selector: 'lf-select',
    templateUrl: './lf-select.html',
    styleUrls: ['./lf-select.scss'],
    host: SELECT_HOST,
    providers: [
        SELECT_VALUE_ACCESSOR,
        { provide: SecureComponent, useExisting: forwardRef(() => LfSelect) },
        { provide: SettableContainerComponent, useExisting: forwardRef(() => LfSelect) }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LfSelect extends NgSelectComponent
    implements FormInputAccessor, ISecureComponent, SettableContainerComponent {
    @Input()
    public name: string;

    @Input()
    public searchMode: SelectControlSearchMode;

    @Output()
    public requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public hiddenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('filterInput')
    protected inputElement: ElementRef;

    @Input()
    public actionType: DropdownActionType = DropdownActionType.DataChange;

    public readonly elementRef: any;

    private _required: boolean;

    private _disabled: boolean;

    private _hidden: boolean;

    private _authorizationLevel: AuthorizationLevel;

    private _mouseOver: boolean;

    private _cdr: ChangeDetectorRef;

    constructor(
        @Attribute('class') classes: string,
        @Attribute('tabindex') tabIndex: string,
        @Attribute('autofocus') autoFocus: any,
        config: NgSelectConfig,
        @Inject(SELECTION_MODEL_FACTORY) newSelectionModel: SelectionModelFactory,
        elementRef: ElementRef,
        cd: ChangeDetectorRef,
        console: ConsoleService
    ) {
        super(classes, tabIndex, autoFocus, config, newSelectionModel, elementRef, cd, console);
        this._cdr = cd;
        this.elementRef = elementRef;
        this.bindValue = 'value';
        this.setSearchFunction((config as LfSelectConfig).searchMode);
        this.setCompareWithFunction();
    }

    protected setSearchFunction(searchMode: SelectControlSearchMode): void {
        this.searchFn = searchMode == SelectControlSearchMode.matchFromStart ? this.matchStartSearch : null;
    }

    protected matchStartSearch(term: string, item: ListItem): boolean {
        term = term.toLocaleLowerCase();
        return item.label.toLocaleLowerCase().startsWith(term);
    }

    protected setCompareWithFunction(): void {
        this.compareWith = this.compareWithFn;
    }

    private compareWithFn(listItem: ListItem, value: any): boolean {
        if (listItem && LangUtil.isDefined(listItem.value) && LangUtil.isDefined(value)) {
            if (LangUtil.isString(listItem.value)) {
                return listItem.value.toLowerCase() === value.toLowerCase();
            }
            // Use non-strict comparison for numeric listItem.value-s
            return listItem.value == value;
        }
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.searchMode) {
            this.setSearchFunction(this.searchMode);
        }
    }

    public writeValue(value: any | any[]): void {
        // convert value to string type to allow binding with number
        if (this.multiple) {
            value = (<any[]>value).map(item => {
                return String(item);
            });
        } else {
            value = String(value);
        }
        super.writeValue(value);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (this.needToClearSelectedItem(changes.items)) {
            this.clearModel();
        }
    }

    private needToClearSelectedItem(change: SimpleChange): boolean {
        return (
            change &&
            change.previousValue !== undefined &&
            !ListUtil.areEqual(change.currentValue, change.previousValue) &&
            !this.currentSelectionInItems(change.currentValue)
        );
    }

    private currentSelectionInItems(items: Array<ListItem>): boolean {
        if (this.selectedItems.length == 0) return true;
        const firstSelectedItem = this.selectedItems[0].value as ListItem;
        return ListUtil.isItemExist(items, firstSelectedItem.value);
    }

    @Input()
    public set required(value: boolean) {
        this.updateRequired(value);
    }

    public get required(): boolean {
        return this._required;
    }

    @Input()
    public set disabled(value: boolean) {
        this.updateDisabled(value);
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    // Overrides method from parent class
    public setDisabledState(value: boolean): void {
        this.updateDisabled(value);
    }

    public setFocus(): void {
        this.inputElement.nativeElement.focus();
    }

    public onMouseEnter(e: MouseEvent): void {
        this._mouseOver = true;
    }

    public onMouseLeave(e: MouseEvent): void {
        this._mouseOver = false;
    }

    public showClear(): boolean {
        return this.clearable && this._mouseOver && (this.hasValue || this.filterValue) && !this.disabled;
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateDisabled(this._disabled);
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateDisabled(value: boolean): void {
        // Ignore when called from base class before component got initialized
        if (this._cdr) {
            const newValue = AuthorizationUtil.isInputSelectComponentDisabled(this._authorizationLevel, this.actionType)
                ? true
                : value;
            if (this._disabled != newValue) {
                this._disabled = newValue;
                this.disabledChange.emit(newValue);
                this._cdr.markForCheck();
            }
        }
    }

    protected updateHidden(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentHidden(this._authorizationLevel) ? true : value;
        if (this._hidden != newValue) {
            this._hidden = newValue;
            this.hiddenChange.emit(newValue);
            this._cdr.markForCheck();
        }
    }

    protected updateRequired(value: any): void {
        const newValue = value === '' ? true : value;
        if (this._required != newValue) {
            this._required = newValue;
            this.requiredChange.emit(newValue);
            this._cdr.markForCheck();
        }
    }

    // SettableContainerComponent interface implementation
    public setContainer(containerSelector: ContainerSelector): void {
        this.appendTo = containerSelector;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        (this as any)._cd = null;
        this._cdr = null;
    }
}

export enum SelectControlSearchMode {
    matchFromStart = 'matchFromStart',
    matchAnywhere = 'matchAnywhere'
}
