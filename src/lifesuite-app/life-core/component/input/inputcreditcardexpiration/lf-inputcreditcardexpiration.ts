import {
    Component,
    Input,
    Provider,
    ElementRef,
    forwardRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';

import { LfCompositeInputComponent, ModelProperty } from '../shared/lf-composite-input.component';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult } from '../shared/validators';
import { SecureComponent } from '../../authorization';
import { CrediCardExpirationDateModel } from './creditcardexpiration.model';

export const INPUTCREDITCARDEXPIRATION_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputCreditCardExpiration),
    multi: true
};

export const INPUTCREDITCARDEXPIRATION_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputCreditCardExpiration),
    multi: true
};

export const CreditCardExpirationPartNames = {
    YEAR: 'year',
    MONTH: 'month'
};

@Component({
    selector: 'lf-inputcreditcardexpiration',
    templateUrl: './lf-inputcreditcardexpiration.html',
    styleUrls: ['../shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTCREDITCARDEXPIRATION_VALUE_ACCESSOR,
        INPUTCREDITCARDEXPIRATION_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputCreditCardExpiration) }
    ]
})
export class LfInputCreditCardExpiration extends LfCompositeInputComponent<CrediCardExpirationDateModel>
    implements ControlValueAccessor {
    @ViewChild(CreditCardExpirationPartNames.MONTH)
    private elementMonth: ElementRef<HTMLInputElement>;
    @ViewChild(CreditCardExpirationPartNames.YEAR)
    private elementYear: ElementRef<HTMLInputElement>;

    @Input()
    public expirationFormatText: string = '(mm/yyyy)';

    private onModelChange: Function = () => {};
    private onModelTouched: Function = () => {};

    @ViewChild(CreditCardExpirationPartNames.MONTH)
    protected inputElement: ElementRef<HTMLInputElement>;
    public monthInputStyleClass: string = 'secure-text';
    public yearInputStyleClass: string = 'secure-text';

    protected validatorFn: Validator = null;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
        this.createValidator();
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult = this.validatorFn(control);
        if (!validationResult) validationResult = this.executeCustomValidators(control);
        return validationResult;
    }

    protected createValidator(): void {
        const self = this;
        const isValueValid = function(value: CrediCardExpirationDateModel): boolean {
            return self.isValueValid(value);
        };
        this.validatorFn = ValidatorFactory.createValidationFunctionValidator(ValidatorTypes.General, isValueValid);
    }

    protected isValueValid(value: CrediCardExpirationDateModel): boolean {
        return (
            (!value.month && !value.year) ||
            (this.validateExpirationDateFormat(value.month, value.year) &&
                this.validateExpirationDateValue(value.month, value.year))
        );
    }

    protected validateExpirationDateFormat(month: string, year: string): boolean {
        const monthReg: RegExp = /^((0[1-9])|(1[0-2]))$/;
        const yearReg: RegExp = /^[1-9]([0-9]{3})$/;
        return monthReg.test(month) && yearReg.test(year);
    }

    protected validateExpirationDateValue(month: string, year: string): boolean {
        const expirationDate: Date = new Date(Number(year), Number(month) - 1, 1);
        const currentDate: Date = new Date();
        const firstDay: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return expirationDate >= firstDay;
    }

    protected get elementNames(): Array<string> {
        return [CreditCardExpirationPartNames.MONTH, CreditCardExpirationPartNames.YEAR];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: CreditCardExpirationPartNames.MONTH, type: 'string' },
            { name: CreditCardExpirationPartNames.YEAR, type: 'string' }
        ];
    }

    protected initElementsData(): void {
        super.initElementsData();
        this.elementsDataArray.forEach(elementData => {
            elementData.regExp = /[0-9]/;
        });
    }

    protected updateElementsData(): void {
        this.elementsData[CreditCardExpirationPartNames.MONTH].elementRef = this.elementMonth;
        this.elementsData[CreditCardExpirationPartNames.YEAR].elementRef = this.elementYear;
        super.updateElementsData();
    }

    public writeValue(value: CrediCardExpirationDateModel): void {
        this.value = value || ({} as CrediCardExpirationDateModel);
        this.updateElementValues();
    }

    public registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    public registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    public setDisabledState(value: boolean): void {
        this.updateDisabled(value);
    }

    public onMonthBlur(event: Event): void {
        super.onBlur(event);
        this.monthInputStyleClass = 'secure-text';

        this.onModelTouched();
        this.updateModel();
    }

    public onYearBlur(event: Event): void {
        super.onBlur(event);
        this.yearInputStyleClass = 'secure-text';
        this.onModelTouched();
        this.updateModel();
    }

    public onMonthFocus(event: Event): void {
        super.onFocus(event);
        this.monthInputStyleClass = '';
    }

    public onYearFocus(event: Event): void {
        super.onFocus(event);
        this.yearInputStyleClass = '';
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (this.readonly) {
            return;
        }
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (this.readonly) {
            return;
        }
        super.onKeyPress(event);
    }

    public updateModel(): void {
        this.onModelChange(!this.isValueEmpty() ? this.value : null);
    }
}
