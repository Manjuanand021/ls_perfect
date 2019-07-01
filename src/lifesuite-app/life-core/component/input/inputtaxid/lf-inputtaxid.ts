import {
    Component,
    Input,
    Provider,
    ElementRef,
    forwardRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

import { LfInputText } from '../inputtext/lf-inputtext';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult, InputUtil, INPUT_HOST } from '../shared';
import { SecureComponent } from '../../authorization';
import { InputTaxIdConfig } from './inputtaxid.config';

export const INPUTTAXID_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputTaxId),
    multi: true
};

export const INPUTTAXID_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputTaxId),
    multi: true
};

@Component({
    selector: 'lf-inputtaxid',
    templateUrl: './lf-inputtaxid.html',
    inputs: ['disabled', 'hidden', 'required', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTTAXID_VALUE_ACCESSOR,
        INPUTTAXID_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputTaxId) }
    ]
})
export class LfInputTaxId extends LfInputText {
    @Input()
    public alwaysMasked: boolean;

    protected validatorFn: Validator = null;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, config: InputTaxIdConfig) {
        super(elementRef, cdr);
        this.createValidator();
        this.alwaysMasked = config.alwaysMasked;
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult = this.validatorFn(control);
        if (!validationResult) validationResult = this.executeCustomValidators(control);
        return validationResult;
    }

    protected createValidator(): void {
        this.validatorFn = ValidatorFactory.createRegExpControlValidator(
            ValidatorTypes.TaxId,
            this.taxIdRegExp,
            'invalidTaxId'
        );
    }

    public updateModel(): void {
        this.onModelChange(this.value);
    }

    protected updateValue(value: any): void {
        this.value = this.format(value);
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
        return this.alwaysMasked && this.value ? 'secure-text' : '';
    }

    protected isValidCharCode(charCode: number): boolean {
        const char = String.fromCharCode(charCode);
        return this.restrictRegExp.test(char);
    }

    protected format(value: string): string {
        const AreaNumberLength = 3;
        const GroupNumberLength = 2;
        const SerialNumberLengths = 4;
        let formattedValue = '';
        if (value) {
            const unformattedValue = this.removeSeparator(value);
            if (unformattedValue.length == this.maxValueLength) {
                const partAreaNumber = unformattedValue.substr(0, AreaNumberLength);
                const partGroupNumber = unformattedValue.substr(AreaNumberLength, GroupNumberLength);
                const partSerialNumber = unformattedValue.substr(
                    AreaNumberLength + GroupNumberLength,
                    SerialNumberLengths
                );
                formattedValue = `${partAreaNumber}-${partGroupNumber}-${partSerialNumber}`;
            } else {
                formattedValue = value;
            }
        }
        return formattedValue;
    }

    private removeSeparator(value: string): string {
        let newValue = value;
        if (value.indexOf(PARTS_SEPARATOR) != -1) {
            const pattern: RegExp = /-/g;
            newValue = value.replace(pattern, '');
        }
        return newValue;
    }

    public get maxValueLength(): number {
        return MAX_VALUE_LENGTH;
    }

    public get maxFormattedValueLength(): number {
        return MAX_FORMATTED_VALUE_LENGTH;
    }

    protected get restrictRegExp(): RegExp {
        return /[0-9-]/;
    }

    protected get taxIdRegExp(): Array<RegExp> {
        return [/\b(?!000)(?!666)(?!9)[0-9]{3}[-]?(?!00)[0-9]{2}[-]?(?!0000)[0-9]{4}\b/];
    }
}

const MAX_VALUE_LENGTH = 9;
const MAX_FORMATTED_VALUE_LENGTH = 11;
const PARTS_SEPARATOR = '-';
