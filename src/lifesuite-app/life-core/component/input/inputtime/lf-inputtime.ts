import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    Output,
    Provider,
    ViewChild
} from '@angular/core';
import { FormatWidth } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTimepicker, NgbTimepickerConfig, NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import { AuthorizationLevel } from 'life-core/authorization';
import { LangUtil } from 'life-core/util/lang';
import { LOCALE_ID } from 'life-core/i18n';
import { DateFormatRetriever, TimeFormatInfo } from 'life-core/util/formatter';
import { FormInputAccessor } from '../shared/form-input.accessor';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from '../../authorization';
import { InputUtil } from '../shared';

export const INPUTTIME_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputTime),
    multi: true
};

@Component({
    selector: 'lf-inputtime',
    templateUrl: './lf-inputtime.html',
    styleUrls: ['./lf-inputtime.css'],
    providers: [INPUTTIME_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LfInputTime) }]
})
export class LfInputTime extends NgbTimepicker implements FormInputAccessor, ISecureComponent {
    protected onNgChange = (_: any) => {};

    protected value: Date;

    /**
     * Specifies the locale ID.
     */
    @Input()
    public localeId: string;

    @Input()
    public name: string;

    @Output()
    public requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public hiddenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('inputfield')
    protected inputElement: ElementRef<HTMLInputElement>;

    public elementRef: ElementRef<HTMLElement>;

    private _dateFormatRetriever: DateFormatRetriever;

    private _required: boolean;

    private _disabled: boolean;

    private _hidden: boolean;

    private _authorizationLevel: AuthorizationLevel;

    constructor(
        config: NgbTimepickerConfig,
        adapter: NgbTimeAdapter<any>,
        elementRef: ElementRef,
        @Inject(LOCALE_ID) localeId: string,
        dateFormatRetriever: DateFormatRetriever
    ) {
        super(config, adapter);
        this.elementRef = elementRef;
        this._dateFormatRetriever = dateFormatRetriever;
        this.meridian = this.isMeridian(localeId);
        this.spinners = false;
    }

    public writeValue(value: any): void {
        this.value = value;
        const ngbTimeValue: NgbTimeStruct = LangUtil.isDate(this.value)
            ? { hour: this.value.getHours(), minute: this.value.getMinutes(), second: this.value.getSeconds() }
            : null;
        super.writeValue(ngbTimeValue);
    }

    public registerOnChange(fn: (value: any) => any): void {
        this.onNgChange = fn;
    }

    public onChange = (value: NgbTimeStruct) => {
        const dateValue: Date = value ? this.appendNgbTimeToDate(this.value, value) : null;
        this.onNgChange(dateValue);
    };

    protected appendNgbTimeToDate(date: Date, time: NgbTimeStruct): Date {
        return date && time
            ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute, time.second)
            : null;
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (InputUtil.ignoreKeyPress(event)) {
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

    protected get restrictRegExp(): RegExp {
        return /[0-9]/;
    }
	
    private isMeridian(localeId: string): boolean {
        const format = this._dateFormatRetriever.getLocaleTimeFormat(localeId, FormatWidth.Medium);
        const timeFormatInfo = new TimeFormatInfo(format, true);
        return timeFormatInfo.is12HourFormat;
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

    public setFocus(): void {
        this.inputElement.nativeElement.focus();
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

    protected updateDisabled(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentDisabled(this._authorizationLevel) ? true : value;
        // Ignore this._disabled=undefined, because this method is called from base class' constructor
        if (!!this._disabled != newValue) {
            this._disabled = newValue;
            this.disabledChange.emit(newValue);
        }
    }

    protected updateHidden(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentHidden(this._authorizationLevel) ? true : value;
        if (this._hidden != newValue) {
            this._hidden = newValue;
            this.hiddenChange.emit(newValue);
        }
    }

    protected updateRequired(value: any): void {
        const newValue = value === '' ? true : value;
        if (this._required != newValue) {
            this._required = newValue;
            this.requiredChange.emit(newValue);
        }
    }
}
