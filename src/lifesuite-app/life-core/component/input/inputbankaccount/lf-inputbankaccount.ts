import { Component, Provider, ElementRef, forwardRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

import { LfInputText } from '../inputtext/lf-inputtext';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult, INPUT_HOST, InputUtil } from '../shared';
import { SecureComponent } from './../../authorization';

export const INPUTBANKACCOUNT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputBankAccount),
    multi: true
};

export const INPUTBANKACCOUNT_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputBankAccount),
    multi: true
};

@Component({
    selector: 'lf-inputbankaccount',
    templateUrl: './lf-inputbankaccount.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTBANKACCOUNT_VALUE_ACCESSOR,
        INPUTBANKACCOUNT_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputBankAccount) }
    ]
})
export class LfInputBankAccount extends LfInputText {
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
        this.validatorFn = ValidatorFactory.createRegExpControlValidator(
            ValidatorTypes.General,
            this.bankAccountRegExp
        );
    }

    public updateModel(): void {
        this.onModelChange(this.value);
    }

    public onBlur(event: Event): void {
        super.onBlur(event);
        this.updateNativeValue(this.value);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (InputUtil.ignoreKeyPress(event)) {
            return;
        }
        if (this.readonly) {
            return;
        }
        if (!this.isValidCharCode(event.charCode)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }

    public get inputStyleClass(): string {
        return this.focused ? '' : 'secure-text';
    }

    protected isValidCharCode(charCode: number): boolean {
        const char = String.fromCharCode(charCode);
        return this.restrictRegExp.test(char);
    }

    protected get restrictRegExp(): RegExp {
        return /[0-9]/;
    }

    protected get bankAccountRegExp(): Array<RegExp> {
        return [/^\d+$/];
    }
}
