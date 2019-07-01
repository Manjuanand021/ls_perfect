/*
 * Adopted from ng-bootstrap/src/datepicker/datepicker-input.ts
 * to use component instead of directive.
 */
import {
    Component,
    ComponentRef,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    Inject,
    Provider,
    ViewChild,
    ViewEncapsulation,
    Renderer2,
    ViewContainerRef,
    ComponentFactoryResolver,
    SimpleChanges,
    TemplateRef,
    NgZone,
    OnChanges,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
    NgbDatepicker,
    NgbDateParserFormatter,
    NgbCalendar,
    NgbDatepickerConfig,
    NgbDateAdapter,
    NgbDate,
    NgbDateStruct,
    Placement
} from '@ng-bootstrap/ng-bootstrap';
// import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/esm5/datepicker/datepicker-service';
import { DayTemplateContext } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-day-template-context';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { ngbFocusTrap } from '@ng-bootstrap/ng-bootstrap/esm5/util/focus-trap';
import { Key } from '@ng-bootstrap/ng-bootstrap/esm5/util/key';
//import { positionElements } from '@ng-bootstrap/ng-bootstrap/esm5/util/positioning';
import { positionElements } from 'life-core/component/dialog/popover/positioning';
import { Subject, fromEvent, race, NEVER } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LangUtil } from 'life-core/util/lang';
import { DateUtil, DateFormatter, DateTimeFormatWidth } from 'life-core/util';
import { SettableContainerComponent, ContainerSelector, isContainerSelector } from 'life-core/component/container';
import { LfInputComponent } from '../shared/lf-input.component';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult } from '../shared/validators';
import { InputProperties } from '../shared/input-properties';
import { LfInputDateUtil } from './lf-inputdate.util';
import { SecureComponent } from './../../authorization';

export type PlacementArray = Placement | Array<Placement>;

const INPUTDATE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputDate),
    multi: true
};

const INPUTDATE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputDate),
    multi: true
};

export const DATEPICKER_HOST: any = {
    // custom change starts
    // '(input)': 'manualDateChange($event.target.value)',
    // custom change ends
    '(change)': 'manualDateChange($event.target.value, true)',
    '(blur)': 'onBlur()'
};

@Component({
    selector: 'lf-inputdate',
    templateUrl: './lf-inputdate.html',
    styleUrls: ['./lf-inputdate.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: DATEPICKER_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTDATE_VALUE_ACCESSOR,
        INPUTDATE_VALIDATOR,
        // NgbDatepickerService,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputDate) },
        { provide: SettableContainerComponent, useExisting: forwardRef(() => LfInputDate) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class LfInputDate extends LfInputComponent<Date>
    implements OnChanges, OnDestroy, ControlValueAccessor, SettableContainerComponent {
    private _closed$ = new Subject();
    private _cRef: ComponentRef<NgbDatepicker> = null;
    private _model: NgbDate;
    private _zoneSubscription: any;

    /**
     * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
     *
     * By default the popup will close on both date selection and outside click. If the value is 'false' the popup has to
     * be closed manually via '.close()' or '.toggle()' methods. If the value is set to 'inside' the popup will close on
     * date selection only. For the 'outside' the popup will close only on the outside click.
     *
     * @since 3.0.0
     */
    @Input()
    autoClose: boolean | 'inside' | 'outside' = true;

    /**
     * Reference for the custom template for the day display
     */
    @Input()
    public dayTemplate: TemplateRef<DayTemplateContext>;

    /**
     * Number of months to display
     */
    @Input()
    public displayMonths: number;

    /**
     * First day of the week. With default calendar we use ISO 8601: 1=Mon ... 7=Sun
     */
    @Input()
    public firstDayOfWeek: number;

    /**
     * Callback to mark a given date as disabled.
     * 'Current' contains the month that will be displayed in the view
     */
    @Input()
    public markDisabled: (date: NgbDateStruct, current: { year: number; month: number }) => boolean;

    /**
     * Min date for the navigation. If not provided will be 10 years before today or `startDate`
     * Custom change: the property is changed to 'Date' type
     */
    @Input()
    public minDate: Date;

    /**
     * Max date for the navigation. If not provided will be 10 years from today or `startDate`
     * Custom change: the property is changed to 'Date' type
     */

    @Input()
    public maxDate: Date;

    /**
     * Navigation type: `select` (default with select boxes for month and year), `arrows`
     * (without select boxes, only navigation arrows) or `none` (no navigation at all)
     */
    @Input()
    public navigation: 'select' | 'arrows' | 'none';

    /**
     * The way to display days that don't belong to current month: `visible` (default),
     * `hidden` (not displayed) or `collapsed` (not displayed with empty space collapsed)
     */
    @Input()
    public outsideDays: 'visible' | 'collapsed' | 'hidden';

    /**
     * Placement of a datepicker popup accepts:
     *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
     *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
     * and array of above values.
     */
    @Input()
    public placement: PlacementArray = 'bottom-left';

    /**
     * Whether to display days of the week
     */
    @Input()
    public showWeekdays: boolean;

    /**
     * Whether to display week numbers
     */
    @Input()
    public showWeekNumbers: boolean;

    /**
     * Date to open calendar with.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided, calendar will open with current month.
     * Use 'navigateTo(date)' as an alternative
     */
    @Input()
    public startDate: { year: number; month: number; day?: number };

    /**
     * A selector specifying the element the datepicker popup should be appended to.
     * Currently only supports "body".
     */
    @Input()
    public container: string;

    /**
     * An event fired when user selects a date using keyboard or mouse.
     * The payload of the event is currently selected NgbDate.
     *
     * @since 1.1.1
     */
    @Output()
    dateSelect = new EventEmitter<NgbDate>();

    /**
     * An event fired when navigation happens and currently displayed month changes.
     * See NgbDatepickerNavigateEvent for the payload info.
     */
    @Output()
    public navigate: EventEmitter<NgbDatepickerNavigateEvent> = new EventEmitter<NgbDatepickerNavigateEvent>();

    protected _onChange = (_: any) => {};
    private _onTouched = () => {};
    private _validatorChange = () => {};

    constructor(
        private _parserFormatter: NgbDateParserFormatter,
        private _elRef: ElementRef,
        private _vcRef: ViewContainerRef,
        private _renderer: Renderer2,
        private _cfr: ComponentFactoryResolver,
        private _ngZone: NgZone,
        // private _service: NgbDatepickerService,
        private _calendar: NgbCalendar,
        private _dateAdapter: NgbDateAdapter<any>,
        @Inject(DOCUMENT) private _document: any,
        // custom properties start
        cdr: ChangeDetectorRef,
        private _config: NgbDatepickerConfig,
        private _dateFormatter: DateFormatter // custom properties end
    ) {
        super(_elRef, cdr);

        // custom change starts
        this.createValidators();
        this.placeholder = _dateFormatter.paddedShortDateFormat.toUpperCase();
        // custom change ends
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._cRef) {
                positionElements(
                    this._elRef.nativeElement,
                    this._cRef.location.nativeElement,
                    this.placement,
                    // custom change starts
                    // this.container === 'body'
                    isContainerSelector(this.container)
                    // custom change ends
                );
            }
        });
    }

    public registerOnChange(fn: (value: any) => any): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    public registerOnValidatorChange(fn: () => void): void {
        this._validatorChange = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        // custom change starts
        // this._renderer.setProperty(this._elRef.nativeElement, 'disabled', isDisabled);
        // custom change ends
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(isDisabled);
        }
    }

    public writeValue(value: any): void {
        // custom change starts
        if (this.modelAsString) {
            value = DateUtil.stringToDate(value);
        }
        this.value = value;
        // custom change ends

        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }

    public manualDateChange(value: string, updateView = false): void {
        this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        // custom change starts
        this.onChange(this._model ? this._dateAdapter.toModel(this._model) : value === '' ? null : value);
        // custom change ends
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }

    private isOpen(): boolean {
        return !!this._cRef;
    }

    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     */
    private open(): void {
        if (!this.isOpen()) {
            const cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);

            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));

            // date selection event handling
            this._cRef.instance.registerOnChange(selectedDate => {
                this.writeValue(selectedDate);
                this.onChange(selectedDate);
            });

            this._cRef.changeDetectorRef.detectChanges();

            this._cRef.instance.setDisabledState(this.disabled);

            // custom change starts
            // if (this.container === 'body') {
            if (isContainerSelector(this.container)) {
                window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // custom change ends

            // focus handling
            ngbFocusTrap(this._cRef.location.nativeElement, this._closed$, true);

            this._cRef.instance.focus();

            // closing on ESC and outside clicks
            this._ngZone.runOutsideAngular(() => {
                const escapes$ = fromEvent<KeyboardEvent>(this._document, 'keyup').pipe(
                    takeUntil(this._closed$),
                    filter(e => e.which === Key.Escape)
                );

                let outsideClicks$;
                if (this.autoClose === true || this.autoClose === 'outside') {
                    // we don't know how the popup was opened, so if it was opened with a click,
                    // we have to skip the first one to avoid closing it immediately
                    let isOpening = true;
                    requestAnimationFrame(() => (isOpening = false));

                    outsideClicks$ = fromEvent<MouseEvent>(this._document, 'click').pipe(
                        takeUntil(this._closed$),
                        filter(event => !isOpening && this._shouldCloseOnOutsideClick(event))
                    );
                } else {
                    outsideClicks$ = NEVER;
                }

                race<Event>([escapes$, outsideClicks$]).subscribe(() => this._ngZone.run(() => this.close()));
            });
        }
    }

    /**
     * Closes the datepicker popup.
     */
    private close(): void {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._closed$.next();
        }
    }

    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     */
    private toggle(): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     */
    private navigateTo(date?: { year: number; month: number; day?: number }): void {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }

    public onBlur(event: any): void {
        this._onTouched();
        // custom change starts
        this.manualDateChange(event.target.value);
        // custom change ends
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // Custom change starts
        if (InputProperties.minDate in changes) {
            this.onMinDateChange();
        }
        if (InputProperties.maxDate in changes) {
            this.onMaxDateChange();
        }
        // Custom change ends
    }

    public ngOnDestroy(): void {
        this.close();
        this._zoneSubscription.unsubscribe();
        this._vcRef = undefined;
    }

    private _applyDatepickerInputs(datepickerInstance: NgbDatepicker): void {
        [
            'dayTemplate',
            'displayMonths',
            'firstDayOfWeek',
            'markDisabled',
            'minDate',
            'maxDate',
            'navigation',
            'outsideDays',
            'showNavigation',
            'showWeekdays',
            'showWeekNumbers'
        ].forEach((optionName: string) => {
            if (this[optionName] !== undefined) {
                // Custom change starts
                datepickerInstance[optionName] = this.getDatepickerInput(this, optionName);
                // Custom change ends
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }

    private _applyPopupStyling(nativeElement: any): void {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    }

    private _shouldCloseOnOutsideClick(event: MouseEvent) {
        return ![this._elRef.nativeElement, this._cRef.location.nativeElement].some(el => el.contains(event.target));
    }

    private _subscribeForDatepickerOutputs(datepickerInstance: NgbDatepicker) {
        datepickerInstance.navigate.subscribe(date => this.navigate.emit(date));
        datepickerInstance.select.subscribe(date => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }

    private _writeModelValue(model: NgbDate): void {
        // Custom change starts
        this._renderer.setProperty(this.inputElement.nativeElement, 'value', this._parserFormatter.format(model));
        // Custom change ends
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }

    private _fromDateStruct(date: NgbDateStruct): NgbDate {
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }

    // Custom code start

    @Input()
    public localeId: string;

    @Input()
    public modelAsString: boolean;

    @Input()
    public stripTime: boolean;

    @ViewChild('datepicker')
    protected inputElement: ElementRef<HTMLInputElement>;

    public placeholder: string;

    protected validatorFn: Validator = null;

    protected minValidateFn: Validator = null;

    protected maxValidateFn: Validator = null;

    public onDateButtonClick(): void {
        this.toggle();
    }

    public validate(c: FormControl): ValidationResult {
        const dateValue = this.modelAsString ? DateUtil.stringToDate(c.value) : c.value;
        return this.validateValue(c, dateValue);
    }

    public validateValue(c: FormControl, value: any): ValidationResult {
        let validationResult: ValidationResult = this.validatorFn(c, value);
        if (this.minValidateFn && !validationResult) {
            validationResult = this.minValidateFn(c, value);
        }
        if (this.maxValidateFn && !validationResult) {
            validationResult = this.maxValidateFn(c, value);
        }
        if (!validationResult) validationResult = this.executeCustomValidators(c, value);

        return validationResult;
    }

    protected createValidators(): void {
        this.createValueValidator();
        this.createMinValidator();
        this.createMaxValidator();
    }

    protected createValueValidator(): void {
        const self: LfInputDate = this;
        const isValueValid = function(value: string): boolean {
            if (LangUtil.isString(value)) {
                const ngbDateStruct = self._parserFormatter.parse(value);
                const ngbDate = self._fromDateStruct(ngbDateStruct);
                return ngbDate != null;
            }
            if (LangUtil.isDate(value)) return !isNaN(Date.parse(value));
            return true;
        };
        this.validatorFn = ValidatorFactory.createDateValidator(ValidatorTypes.DateRange, isValueValid);
    }

    protected createMinValidator(): void {
        if (this._config.minDate) {
            this.minDate = LfInputDateUtil.ngbDateToDate(this._config.minDate);
            this.updateMinValidator();
        }
    }

    protected createMaxValidator(): void {
        if (this._config.maxDate) {
            this.maxDate = LfInputDateUtil.ngbDateToDate(this._config.maxDate);
            this.updateMaxValidator();
        }
    }

    protected onMinDateChange(): void {
        this.minDate = this.minDate ? this.minDate : LfInputDateUtil.ngbDateToDate(this._config.minDate);
        this.updateMinValidator();
    }

    protected updateMinValidator(): void {
        if (this.minDate) {
            const minDate: Date = LangUtil.isDate(this.minDate) ? this.minDate : new Date(this.minDate);
            this.minValidateFn = ValidatorFactory.createRangeMinValidator(ValidatorTypes.DateRange, minDate);
        }
    }

    protected onMaxDateChange(): void {
        this.maxDate = this.maxDate ? this.maxDate : LfInputDateUtil.ngbDateToDate(this._config.maxDate);
        this.updateMaxValidator();
    }

    protected updateMaxValidator(): void {
        if (this.maxDate) {
            const maxDate: Date = LangUtil.isDate(this.maxDate) ? this.maxDate : new Date(this.maxDate);
            this.maxValidateFn = ValidatorFactory.createRangeMaxValidator(ValidatorTypes.DateRange, maxDate);
        }
    }

    protected onChange(value: any): void {
        if (this.modelAsString && LangUtil.isDate(value)) {
            console.log(`before formatting- ${value}`);
            value = this.stripTime
                ? this._dateFormatter.format(value, DateTimeFormatWidth.ShortDate)
                : this._dateFormatter.format(value, DateTimeFormatWidth.ShortDateMediumTime);
            console.log(`after formatting- ${value}`);
        }
        this._onChange(value);
    }

    protected updateCurrentValue(newValue: Date): Date {
        return this.value ? DateUtil.appendTimeToDate(newValue, this.value) : newValue;
    }

    private getDatepickerInput(thisComponent: LfInputDate, optionName: string): any {
        const propertyValue = thisComponent[optionName];
        if (optionName == 'minDate' || optionName == 'maxDate') {
            const dateValue = LangUtil.isDate(propertyValue) ? propertyValue : new Date(propertyValue);
            return LfInputDateUtil.dateToNgbDate(dateValue);
        }
        return propertyValue;
    }

    // SettableContainerComponent interface implementation
    public setContainer(containerSelector: ContainerSelector): void {
        this.container = containerSelector;
    }

    // Custom code - end
}
