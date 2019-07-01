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
import { SecureComponent } from './../../authorization';

const cardValidator = require('card-validator');

export const INPUTCREDITCARD_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputCreditCard),
    multi: true
};

export const INPUTCREDITCARD_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputCreditCard),
    multi: true
};

export const CreditCardPartNames = {
    MASKED_DIGITS: 'maskedDigits',
    UNMASKED_DIGITS: 'unmaskedDigits'
};

@Component({
    selector: 'lf-inputcreditcard',
    templateUrl: './lf-inputcreditcard.html',
    styleUrls: ['../shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTCREDITCARD_VALUE_ACCESSOR,
        INPUTCREDITCARD_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputCreditCard) }
    ]
})
export class LfInputCreditCard extends LfCompositeInputComponent<any> implements ControlValueAccessor {
    /**
     * Credit Card Type. It must matches the string defined in CreditCardTypes.
     */
    @Input()
    public creditCardType: string;

    @ViewChild(CreditCardPartNames.MASKED_DIGITS)
    private elementMaskedDigits: ElementRef<HTMLInputElement>;
    @ViewChild(CreditCardPartNames.UNMASKED_DIGITS)
    private elementUnmaskedDigits: ElementRef<HTMLInputElement>;

    private onModelChange: Function = () => {};
    private onModelTouched: Function = () => {};

    @ViewChild(CreditCardPartNames.MASKED_DIGITS)
    protected inputElement: ElementRef<HTMLInputElement>;

    public maskedDigitsInputStyleClass: string = 'secure-text';
    protected validatorFn: Validator = null;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
        this.createValidator();
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult = this.validatorFn(control, this.creditCardNumber);
        if (!validationResult) validationResult = this.executeCustomValidators(control, this.creditCardNumber);
        return validationResult;
    }

    protected createValidator(): void {
        const self = this;
        const isValueValid = function(value: any): boolean {
            return self.isValueValid(value);
        };
        this.validatorFn = ValidatorFactory.createValidationFunctionValidator(ValidatorTypes.General, isValueValid);
    }

    protected isValueValid(value: any): boolean {
        if (!this.creditCardType) {
            // if no credit card type is specified, do not validate. Same as LS9
            return true;
        }
        const numberValidation = this.creditCardValidator.number(value);
        if (this.creditCardType != null && this.creditCardType != CreditCardTypes.UNKNOWN && numberValidation.card) {
            return numberValidation.card.type == this.creditCardType && numberValidation.isValid;
        }
        return !value || numberValidation.isValid;
    }

    protected get creditCardValidator(): any {
        return cardValidator;
    }

    protected get elementNames(): Array<string> {
        return [CreditCardPartNames.MASKED_DIGITS, CreditCardPartNames.UNMASKED_DIGITS];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: CreditCardPartNames.MASKED_DIGITS, type: 'string' },
            { name: CreditCardPartNames.UNMASKED_DIGITS, type: 'string' }
        ];
    }

    protected initElementsData(): void {
        super.initElementsData();
        this.elementsDataArray.forEach(elementData => {
            elementData.regExp = /[0-9]/;
        });
    }

    protected updateElementsData(): void {
        this.elementsData[CreditCardPartNames.MASKED_DIGITS].elementRef = this.elementMaskedDigits;
        this.elementsData[CreditCardPartNames.UNMASKED_DIGITS].elementRef = this.elementUnmaskedDigits;
        super.updateElementsData();
    }

    public writeValue(value: any): void {
        this.value = {};
        this.value[CreditCardPartNames.MASKED_DIGITS] = value ? value.substr(0, MASKED_DIGITS_LENGTH) : null;
        this.value[CreditCardPartNames.UNMASKED_DIGITS] = value
            ? value.substr(MASKED_DIGITS_LENGTH, UNMASKED_DIGITS_LENGTH)
            : null;
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

    public onMaskedDigitsBlur(event: Event): void {
        super.onBlur(event);
        this.maskedDigitsInputStyleClass = 'secure-text';
        this.onModelTouched();
        this.updateModel();
    }

    public onMaskedDigitsFocus(event: Event): void {
        super.onFocus(event);
        this.maskedDigitsInputStyleClass = '';
    }

    public onBlur(event: Event): void {
        super.onBlur(event);
        this.onModelTouched();
        this.updateModel();
    }

    public onKeyDown(event: Event): void {
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
        this.onModelChange(!this.isValueEmpty() ? this.creditCardNumber : null);
    }

    protected get creditCardNumber(): string {
        return (
            (this.value[CreditCardPartNames.MASKED_DIGITS] || '') +
            (this.value[CreditCardPartNames.UNMASKED_DIGITS] || '')
        );
    }
}

const MASKED_DIGITS_LENGTH = 12;
const UNMASKED_DIGITS_LENGTH = 4;

export const CreditCardTypes = {
    VISA: 'visa',
    MASTER_CARD: 'master-card',
    DISCOVER: 'discover',
    AMERICAN_EXPRESS: 'american-express',
    DINERS_CLUB: 'diners-club',
    UNKNOWN: 'unknown'
};
