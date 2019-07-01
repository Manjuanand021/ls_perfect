import {
    Injector,
    Component,
    Inject,
    Input,
    Provider,
    ElementRef,
    forwardRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

import { LfInputText } from '../inputtext/lf-inputtext';
import { Validator, ValidationResult, InputUtil, INPUT_HOST } from '../shared';
import { SecureComponent } from '../../authorization';
import {
    ZipCodeValidatorRegistryType,
    ZIPCODE_VALIDATOR_REGISTRY,
    DefaultZipCodeValidator,
    IZipCodeValidator,
    DefaultMaxFormattedValueLength,
    DefaultRestrictRegExp
} from './validator';
import { ZipCodeType } from './inputzipcode.type';

export const INPUTZIPCODE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputZipCode),
    multi: true
};

export const INPUTZIPCODE_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputZipCode),
    multi: true
};

@Component({
    selector: 'lf-inputzipcode',
    templateUrl: './lf-inputzipcode.html',
    host: INPUT_HOST,
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTZIPCODE_VALUE_ACCESSOR,
        INPUTZIPCODE_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputZipCode) }
    ]
})
export class LfInputZipCode extends LfInputText {
    protected _zipCodeType: ZipCodeType = ZipCodeType.Default;
    protected injector: Injector;
    protected zipCodeValidatorRegistry: ZipCodeValidatorRegistryType;
    protected zipCodeValidator: IZipCodeValidator;
    protected validatorFn: Validator = null;

    constructor(
        injector: Injector,
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        @Inject(ZIPCODE_VALIDATOR_REGISTRY) zipCodeValidatorRegistry: ZipCodeValidatorRegistryType
    ) {
        super(elementRef, cdr);
        this.injector = injector;
        this.zipCodeValidatorRegistry = zipCodeValidatorRegistry;
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult = {};
        if (this.validatorFn) validationResult = this.validatorFn(control);
        if (!validationResult) validationResult = this.executeCustomValidators(control);
        return validationResult;
    }

    @Input()
    public set zipCodeType(value: ZipCodeType) {
        if (this._zipCodeType != value) {
            this._zipCodeType = value;
            this.createValidator();
            this.triggerValidation();
        }
    }

    public get zipCodeType(): ZipCodeType {
        return this._zipCodeType;
    }

    protected createValidator(): void {
        const zipCodeValidatorType = this.zipCodeValidatorRegistry[this.zipCodeType];
        this.zipCodeValidator = zipCodeValidatorType
            ? this.injector.get(zipCodeValidatorType)
            : this.injector.get(DefaultZipCodeValidator);
        this.validatorFn = this.zipCodeValidator.createValidator();
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

    protected isValidCharCode(charCode: number): boolean {
        const char = String.fromCharCode(charCode);
        return this.restrictRegExp.test(char);
    }

    protected format(value: string): string {
        return this.zipCodeValidator ? this.zipCodeValidator.formatValue(value) : value;
    }

    public get maxFormattedValueLength(): number {
        return this.zipCodeValidator
            ? this.zipCodeValidator.getMaxFormattedValueLength()
            : DefaultMaxFormattedValueLength;
    }

    protected get restrictRegExp(): RegExp {
        return this.zipCodeValidator ? this.zipCodeValidator.getRestrictRegExp() : DefaultRestrictRegExp;
    }
}
