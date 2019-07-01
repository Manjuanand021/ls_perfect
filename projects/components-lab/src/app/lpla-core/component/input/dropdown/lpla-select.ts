import {
    Component,
    Input,
    forwardRef,
    SimpleChanges,
    SimpleChange,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    Provider,
    Attribute,
    Inject,
    ElementRef,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ListItem } from 'life-core/model';
import { LfSelect, SELECT_HOST } from 'life-core/component/input/dropdown/lf-select';
import { ListFieldDescriptor, IListItem } from 'lpla-core/field';
import { SecureComponent } from 'life-core/component/authorization';
import { SettableContainerComponent } from 'life-core/component/container';
import { NgSelectConfig, SELECTION_MODEL_FACTORY, ɵr as ConsoleService } from '@ng-select/ng-select';
import { SelectionModelFactory } from '@ng-select/ng-select/ng-select/selection-model';

export const LPLA_SELECT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LplaSelect),
    multi: true
};

@Component({
    selector: 'lpla-select',
    templateUrl: '../../../../../../../../src/lifesuite-app/life-core/component/input/dropdown/lf-select.html',
    styleUrls: ['../../../../../../../../src/lifesuite-app/life-core/component/input/dropdown/lf-select.scss'],
    host: SELECT_HOST,
    providers: [
        LPLA_SELECT_VALUE_ACCESSOR,
        { provide: SecureComponent, useExisting: forwardRef(() => LplaSelect) },
        { provide: SettableContainerComponent, useExisting: forwardRef(() => LplaSelect) }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LplaSelect extends LfSelect {
    @Input('fieldModel') fieldModel: ListFieldDescriptor<any>;

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
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if ('fieldModel' in changes) {
            this.updateFieldModel(changes['fieldModel']);
        }
    }

    protected updateFieldModel(change: SimpleChange) {
        this.fieldModel = change.currentValue;
        this.updateList(this.fieldModel.listItems);
        this.disabled = !this.fieldModel.isAvailable || !this.fieldModel.isEditable;
    }

    private updateList(listItems: IListItem<any>[]): void {
        let items = listItems.map(item => new ListItem(item.StringValue, item.CodeID));
        this.items = items;
    }
}
