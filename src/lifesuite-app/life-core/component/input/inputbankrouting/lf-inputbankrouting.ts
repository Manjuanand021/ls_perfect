import { Component, Provider, ElementRef, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

import { LfInputText } from '../inputtext/lf-inputtext';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult, INPUT_HOST, InputUtil } from '../shared';
import { SecureComponent } from './../../authorization';

export const INPUTBANKROUTING_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputBankRouting),
    multi: true
};

export const INPUTBANKROUTING_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputBankRouting),
    multi: true
};

@Component({
    selector: 'lf-inputbankrouting',
    templateUrl: './lf-inputbankrouting.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTBANKROUTING_VALUE_ACCESSOR,
        INPUTBANKROUTING_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputBankRouting) }
    ]
})
export class LfInputBankRouting extends LfInputText {
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
        this.validatorFn = ValidatorFactory.createValidationFunctionValidator(
            ValidatorTypes.General,
            this.isValueValid
        );
    }

    protected isValueValid(value: string): boolean {
        // 1. The ABA number must be nine digits. The first two digits of the nine digit ABA number
        // must be in the ranges 00 through 12, 21 through 32, 61 through 72, or 80
        const regExp: RegExp = /^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/;
        if (!regExp.test(value)) return false;

        // 2. If the resulting sum is an even multiple of ten (but not zero),
        // the ABA routing number is good.
        const singleChars: Array<string> = value.split('');
        let n = 0;
        for (let i = 0; i < singleChars.length; i += 3) {
            n += Number(singleChars[i]) * 3 + Number(singleChars[i + 1]) * 7 + Number(singleChars[i + 2]);
        }
        return n != 0 && n % 10 == 0;
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

    public get maxValueLength(): number {
        return MAX_VALUE_LENGTH;
    }
}

const MAX_VALUE_LENGTH = 9;
