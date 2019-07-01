import {
    Component,
    Input,
    Output,
    Provider,
    ElementRef,
    EventEmitter,
    forwardRef,
    ChangeDetectorRef,
    ViewChild,
    ChangeDetectionStrategy,
    OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

import { FormInputAccessor } from '../shared/form-input.accessor';
import { AuthorizationLevel } from 'life-core/authorization';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from '../../authorization';

export const CHECKBOX_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfCheckbox),
    multi: true
};

@Component({
    selector: 'lf-checkbox',
    templateUrl: './lf-checkbox.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CHECKBOX_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LfCheckbox) }]
})
export class LfCheckbox extends Checkbox implements FormInputAccessor, ISecureComponent, OnDestroy {
    // Override declaration from base class
    @Input()
    public binary: string = 'true';

    @Input()
    public valueType: LfCheckboxValueType;

    @Output()
    public requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public hiddenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public readonly elementRef: ElementRef<HTMLElement>;

    private _required: boolean;

    private _disabled: boolean;

    private _hidden: boolean;

    private _authorizationLevel: AuthorizationLevel;

    @ViewChild('cb')
    protected inputElement: ElementRef<HTMLInputElement>;

    protected cdr: ChangeDetectorRef;

    constructor(cdr: ChangeDetectorRef, elementRef: ElementRef<HTMLElement>) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
    }

    public setFocus(): void {
        if (!this.focused) {
            this.inputElement.nativeElement.focus();
        }
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

    public writeValue(value: any): void {
        super.writeValue(value);
        this.updateNativeValue(value);
    }

    public updateModel(): void {
        this.value = this.getModelValue();
        super.updateModel();
        if (this.isCustomValueType) {
            this.onModelChange(this.value);
        }
    }

    protected updateNativeValue(value: boolean): void {
        this.checked = this.getNativeElementValue(value);
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public ngOnDestroy(): void {
        this.cdr = null;
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateDisabled(this.disabled);
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateRequired(value: any): void {
        const newValue = value === '' ? true : value;
        if (this._required != newValue) {
            this._required = newValue;
            this.requiredChange.emit(newValue);
            this.cdr.markForCheck();
        }
    }

    protected updateDisabled(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentDisabled(this._authorizationLevel) ? true : value;
        if (this._disabled != newValue) {
            this._disabled = newValue;
            this.disabledChange.emit(newValue);
            this.cdr.markForCheck();
        }
    }

    protected updateHidden(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentHidden(this._authorizationLevel) ? true : value;
        if (this._hidden != newValue) {
            this._hidden = newValue;
            this.hiddenChange.emit(newValue);
            this.cdr.markForCheck();
        }
    }

    private getNativeElementValue(value: any): boolean {
        return this.isCustomValueType() ? value === LfCheckBoxValues[this.valueType].checked : value;
    }

    // Returns checkbox custom type value or default value
    private getModelValue(): any {
        if (this.isCustomValueType()) {
            return this.checked ? LfCheckBoxValues[this.valueType].checked : LfCheckBoxValues[this.valueType].unchecked;
        } else {
            return this.checked;
        }
    }

    private isCustomValueType(): boolean {
        return !!this.valueType;
    }
}

export enum LfCheckboxValueType {
    BinaryNumber = 'BinaryNumber',
    BinaryString = 'BinaryString'
}
export type LfCheckboxStateValuesType = { checked: number | string; unchecked: number | string };

const LfCheckBoxValues: { readonly [checkboxValueType: string]: LfCheckboxStateValuesType } = {
    [LfCheckboxValueType.BinaryNumber]: {
        checked: 1,
        unchecked: 0
    },
    [LfCheckboxValueType.BinaryString]: {
        checked: '1',
        unchecked: '0'
    }
};
