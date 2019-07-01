import {
    Component,
    Provider,
    ElementRef,
    forwardRef,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';

import { LangUtil } from 'life-core/util/lang';
import { LfInputComponent } from '../shared/lf-input.component';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult } from '../shared/validators';
import { SecureComponent } from './../../authorization';

export const INPUTDATERANGE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputDateRange),
    multi: true
};

export const INPUTDATERANGE_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputDateRange),
    multi: true
};

@Component({
    selector: 'lf-inputdaterange',
    templateUrl: './lf-inputdaterange.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    styleUrls: ['./lf-inputdaterange.css', '../shared/lf-composite-input.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTDATERANGE_VALUE_ACCESSOR,
        INPUTDATERANGE_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputDateRange) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class LfInputDateRange extends LfInputComponent<DateRange> implements ControlValueAccessor {
    public onModelChange: Function = () => {};
    public onModelTouched: Function = () => {};

    @ViewChild('minDate')
    protected inputElement: ElementRef<HTMLInputElement>;

    protected validatorFn: Validator = null;
    protected startDateValidatorFn: Validator = null;
    protected endDateValidatorFn: Validator = null;
    protected dateRangeValidatorFn: Validator = null;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
        this.createStartDateValidator(); // Adding specific date validators instead of generic.
        this.createEndDateValidator();
        this.createDateRangeValidator();
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult;

        if (!validationResult && this.startDateValidatorFn) {
            validationResult = this.startDateValidatorFn(control);
        }
        if (!validationResult && this.endDateValidatorFn) {
            validationResult = this.endDateValidatorFn(control);
        }

        if (!validationResult && this.dateRangeValidatorFn) {
            validationResult = this.dateRangeValidatorFn(control);
        }

        if (!validationResult) validationResult = this.executeCustomValidators(control);
        return validationResult;
    }

    public writeValue(value: any): void {
        this.value = value || { minDate: null, maxDate: null };
        // since we are binding object properties to min and max date components, need to trigger change detection
        this.cdr.markForCheck();
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

    public onMinDateChange(value: any): void {
        this.value = { minDate: value, maxDate: this.value ? this.value.maxDate : null };
        this.onModelTouched();
        this.updateModel();
    }

    public onMaxDateChange(value: any): void {
        this.value = { maxDate: value, minDate: this.value ? this.value.minDate : null };
        this.onModelTouched();
        this.updateModel();
    }

    public updateModel(): void {
        if (this.value.minDate === null && this.value.maxDate !== null) {
            this.value.minDate = DefaultDates.start;
        }
        if (this.value.minDate === null && this.value.maxDate === null) {
            this.value = DefaultDates.noDate;
        }
        this.onModelChange(this.value);
    }

    private createStartDateValidator(): void {
        const isStartDateValid = (value: any): boolean => {
            return this.isStartDateValid(value);
        };
        this.startDateValidatorFn = ValidatorFactory.createDateValidator(
            ValidatorTypes.DateRange,
            isStartDateValid,
            'invalidStartDate'
        );
    }

    private isStartDateValid(value: any): boolean {
        return !value.minDate || LangUtil.isDate(value.minDate);
    }

    private createEndDateValidator(): void {
        const isEndDateValid = (value: any): boolean => {
            return this.isEndDateValid(value);
        };

        this.endDateValidatorFn = ValidatorFactory.createDateValidator(
            ValidatorTypes.DateRange,
            isEndDateValid,
            'invalidEndDate'
        );
    }

    private isEndDateValid(value: any): boolean {
        return !value.maxDate || LangUtil.isDate(value.maxDate);
    }

    private createDateRangeValidator(): void {
        const isDateRangeValid = (value: any): boolean => {
            return this.isDateRangeValid(value);
        };

        this.dateRangeValidatorFn = ValidatorFactory.createDateValidator(
            ValidatorTypes.DateRange,
            isDateRangeValid,
            'invalidDateRange'
        );
    }

    private isDateRangeValid(value: any): boolean {
        return !value.maxDate || value.maxDate >= value.minDate;
    }
}

export interface DateRange {
    minDate: Date;
    maxDate: Date;
}

export const DefaultDates = {
    start: new Date('January 01, 1900 00:00:00'),
    noDate: undefined
};
