import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Provider,
    OnChanges,
    Output,
    Renderer,
    SimpleChanges,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { IntlService } from 'life-core/i18n';
import { LangUtil } from 'life-core/util/lang';
import {
    ValidatorFactory,
    Validator,
    ValidatorTypes,
    ValidationResult,
    INPUT_HOST,
    InputProperties,
    LfInputComponent,
    InputUtil
} from '../shared';
import { SecureComponent } from '../../authorization';
import { InputNumberConfig } from './inputnumber.config';

export const INPUTNUMBER_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputNumber),
    multi: true
};

export const INPUTNUMBER_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputNumber),
    multi: true
};

@Component({
    selector: 'lf-inputnumber',
    templateUrl: './lf-inputnumber.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTNUMBER_VALUE_ACCESSOR,
        INPUTNUMBER_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputNumber) }
    ]
})
export class LfInputNumber extends LfInputComponent<number> implements OnInit, OnChanges, ControlValueAccessor {
    private intl: IntlService;

    /**
     * Specifies the locale ID.
     */
    @Input()
    public localeId: string;

    /**
     * Sets the title of the input element of the NumericTextBox.
     */
    @Input()
    public inputTitle: string = 'numerictextbox';
    /**
     * Specifies whether the value will be auto-corrected according to the min and max values.
     */
    @Input()
    public autoCorrect: boolean = false;
    /**
     * Specifies the number format used when the component is not focused.
     */
    @Input()
    public format: string = 'n2';
    /**
     * Specifies the maximum length of value.
     */
    @Input()
    public maxLength: number;
    /**
     * Specifies the greatest valid value.
     */
    @Input()
    public max: number;
    /**
     * Specifies the smallest valid value.
     */
    @Input()
    public min: number;
    /**
     * Specifies the number precision applied to the component value when it is focused.
     * If the user enters a number with a greater precision than is currently configured, the component value is rounded.
     */
    @Input()
    public decimals: number = 2; // null

    /**
     * Specifies whether the value should be rounded or truncated.
     */
    @Input()
    public round: boolean = true;
    /**
     * Specifies whether the length of decimals should be restricted during typing.
     */
    @Input()
    public restrictDecimals: boolean = true;
    /**
     * Specifies whether to allow negative value.
     */
    @Input()
    public allowNegative: boolean = true;
    /**
     * Fires each time the user selects a new value.
     */
    @Output()
    public valueChange: EventEmitter<any> = new EventEmitter();
    /**
     * Fires each time the user focuses the input element.
     */
    @Output()
    public focusEventEmitter: EventEmitter<any> = new EventEmitter();
    /**
     * Fires each time the input element gets blurred.
     */
    @Output()
    public blur: EventEmitter<any> = new EventEmitter();

    @ViewChild('numericInput')
    protected inputElement: ElementRef<HTMLInputElement>;

    private filled: boolean = true;
    private renderer: Renderer;
    private DECIMAL_SEPARATOR: string = '.';
    private minValidateFn: Validator = null;
    private maxValidateFn: Validator = null;
    private ngChange: Function = value => {};
    private ngTouched: Function = () => {};
    private _decimalPipe: DecimalPipe;
    constructor(
        config: InputNumberConfig,
        intl: IntlService,
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        renderer: Renderer
    ) {
        super(elementRef, cdr);
        this.intl = intl;
        this.localeId = config.numberLocale;
        this._decimalPipe = new DecimalPipe(this.localeId);
        this.renderer = renderer;
        this.value = undefined;
    }

    public get formattedValue(): string {
        if (this.value || this.value === 0) {
            return this.intl.formatNumber(this.value, this.format, this.localeId);
        }
        return '';
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (InputProperties.localeId in changes) {
            this.updateLocaleId(changes[InputProperties.localeId].currentValue);
        }
        if (InputProperties.min in changes) {
            this.updateMinValidator();
        }
        if (InputProperties.max in changes) {
            this.updateMaxValidator();
        }
    }

    protected updateLocaleId(value: any): void {
        this.localeId = value;
        this.changeText();
    }

    protected updateMinValidator(): void {
        this.minValidateFn = ValidatorFactory.createRangeMinValidator(ValidatorTypes.NumberRange, this.min);
    }

    protected updateMaxValidator(): void {
        this.maxValidateFn = ValidatorFactory.createRangeMaxValidator(ValidatorTypes.NumberRange, this.max);
    }

    public validate(c: FormControl): ValidationResult {
        let validationResult: ValidationResult = null;
        if (this.minValidateFn) {
            validationResult = this.minValidateFn(c);
        }
        if (this.maxValidateFn && !validationResult) {
            validationResult = this.maxValidateFn(c);
        }
        if (!validationResult) {
            validationResult = this.executeCustomValidators(c);
        }

        return validationResult;
    }

    public ngOnInit(): void {
        if (this.value || this.value === 0) {
            this.changeValue(this.value);
        }
    }

    // ngModel binding
    public writeValue(value: number): void {
        this.value = value;
        this.setInputValue(value);
    }

    public registerOnChange(fn: () => any): void {
        this.ngChange = fn;
    }

    public registerOnTouched(fn: () => any): void {
        this.ngTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.updateDisabled(isDisabled);
    }

    private formatValue(value: any): string {
        return value !== null && value !== '' && !LangUtil.isUndefined(value)
            ? this.intl.formatNumber(value, this.format, this.localeId)
            : '';
    }

    private setInputValue(value: number): void {
        const inputValue = this.formatValue(value);
        this.renderer.setElementProperty(this.inputElement.nativeElement, 'value', inputValue);
        // this.inputValue = inputValue;
    }

    private changeValue(value: number): void {
        this.value = value;
        this.ngChange(value);
        if (this.value || this.value === 0) {
            this.changeText();
        }
        this.valueChange.emit(value);
    }

    public onKeyPress(event: any): void {
        if (InputUtil.ignoreKeyPress(event)) {
            return;
        }
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const currentChar = String.fromCharCode(event.which);
        let text = this.inputElement.nativeElement.value;
        text = text.substring(0, start) + currentChar + text.substring(end);
        const isValid = this.numericRegex(this.localeId).test(text) && this.isValidLength(text);
        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public onFocus(event: any): void {
        this.focused = true;
        if (this.value || this.value === 0) {
            this.inputElement.nativeElement.value = this.formatNumberWithSettings();
        }
        this.focusEventEmitter.emit(event);
    }

    public setFocus(): void {
        if (!this.focused) {
            this.inputElement.nativeElement.focus();
        }
    }

    public onBlur(event: any): void {
        if (!this.inputElement.nativeElement.value.length) {
            this.value = undefined;
        }
        this.focused = false;
        let parsedInput = this.intl.parseNumber(this.inputElement.nativeElement.value, undefined, this.localeId);
        if (parsedInput !== null) {
            if (!LangUtil.isUndefined(this.decimals) && this.round) {
                parsedInput = this.roundNumber(parsedInput, this.decimals);
            }
            if (!LangUtil.isUndefined(this.decimals) && !this.round) {
                parsedInput = this.truncateNumber(parsedInput, this.decimals);
            }
        }
        this.changeValue(parsedInput === null ? null : this.autoCorrect ? this.trimValue(parsedInput) : parsedInput);
        this.ngTouched();
        this.blur.emit(event);
    }

    protected hostBlur(): void {
        this.ngTouched();
    }

    private changeText(): void {
        if (this.focused) {
            this.inputElement.nativeElement.value = this.formatNumberWithSettings();
        } else {
            this.inputElement.nativeElement.value = this.intl.formatNumber(this.value, this.format, this.localeId);
        }
    }

    private formatNumberWithSettings(): string {
        if (this.decimals !== null && this.restrictDecimals) {
            return this.intl.formatNumber(
                this.value,
                {
                    // minimumFractionDigits: this.decimals,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: this.decimals,
                    useGrouping: false
                },
                this.localeId
            );
        } else {
            const currentValue = this.value;
            const decimalPart = currentValue.toString().split('.')[1];
            const numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
            return this.intl.formatNumber(this.value, `n${numberOfDecimals}`, this.localeId);
        }
    }

    private numericRegex(locale: string): RegExp {
        const symbols = this.intl.numberSymbols(locale);
        let decimalSeparator = symbols.decimal;
        const negativeRule = this.allowNegative === false ? '' : '(-)?';
        let fractionRule = '*';
        if (decimalSeparator === this.DECIMAL_SEPARATOR) {
            decimalSeparator = `\\${decimalSeparator}`;
        }
        if (this.decimals === 0) {
            return this.getIntergerRegExp(negativeRule);
        }
        if (this.decimals && this.restrictDecimals) {
            fractionRule = `{0,${this.decimals}}`;
        }
        return new RegExp(
            `^${negativeRule}(((\\d+(${decimalSeparator}\\d${fractionRule})?)|(${decimalSeparator}\\d${fractionRule})))?$`
        );
    }

    private getIntergerRegExp(negativeRule: string): RegExp {
        return new RegExp(`^${negativeRule}(\\d*)$`);
    }

    private trimValue(value: number): number {
        if (this.max !== undefined && value > this.max) {
            return this.max;
        }
        if (this.min !== undefined && value < this.min) {
            return this.min;
        }
        return value;
    }

    private roundNumber(value: number, precision: number): number {
        const Exp = 'e';
        const decimals = precision || 0;
        let parts = value.toString().split(Exp);
        let result = Math.round(Number(parts[0] + Exp + (parts[1] ? Number(parts[1]) + decimals : decimals)));
        parts = result.toString().split(Exp);
        result = Number(parts[0] + Exp + (parts[1] ? Number(parts[1]) - decimals : -decimals));
        return Number(result.toFixed(decimals));
    }

    private truncateNumber(value: number, precision: number): number {
        const parts = value.toString().split('.');
        if (parts[1]) {
            parts[1] = parts[1].substring(0, precision);
        }
        return this.intl.parseNumber(parts.join('.'), undefined, this.localeId);
    }

    // Validates input value length to max allowed length
    private isValidLength(value: string): boolean {
        return !(this.maxLength && value && value.length > this.maxLength);
    }
}
