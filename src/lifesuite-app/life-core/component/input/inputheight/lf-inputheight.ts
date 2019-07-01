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

import { LangUtil } from 'life-core/util/lang';
import { MeasurementUtil } from 'life-core/util/measurement';
import { LfCompositeInputComponent, ModelProperty } from '../shared/lf-composite-input.component';
import { ValidatorFactory, Validator, ValidatorTypes, ValidationResult } from '../shared/validators';
import { ValidatorUtil } from '../shared/validator.util';
import { SecureComponent } from './../../authorization';

export const INPUTHEIGHT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputHeight),
    multi: true
};

export const INPUTHEIGHT_NG_VALIDATORS: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LfInputHeight),
    multi: true
};

export const HeightPartNames = {
    FT: 'heightFt',
    INCH: 'heightInch',
    CM: 'heightCm'
};

@Component({
    selector: 'lf-inputheight',
    templateUrl: './lf-inputheight.html',
    styleUrls: ['../shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTHEIGHT_VALUE_ACCESSOR,
        INPUTHEIGHT_NG_VALIDATORS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputHeight) }
    ]
})
export class LfInputHeight extends LfCompositeInputComponent<any> implements ControlValueAccessor {
    @Input()
    public heightFtText: string = 'ft';
    @Input()
    public heightInchText: string = 'in';
    @Input()
    public heightCmText: string = 'cm';

    @ViewChild(HeightPartNames.FT)
    public elementHeightFt: ElementRef<HTMLInputElement>;
    @ViewChild(HeightPartNames.INCH)
    public elementHeightInch: ElementRef<HTMLInputElement>;
    @ViewChild(HeightPartNames.CM)
    public elementHeightCm: ElementRef<HTMLInputElement>;

    @ViewChild(HeightPartNames.FT)
    protected inputElement: ElementRef<HTMLInputElement>;

    public onModelChange: Function = () => {};
    public onModelTouched: Function = () => {};

    protected heightValidators: Validator[];

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
        this.createValidators();
    }

    public validate(control: FormControl): ValidationResult {
        let validationResult: ValidationResult = ValidatorUtil.executeValidators(
            this.heightValidators,
            control,
            this.value
        );
        if (!validationResult) {
            validationResult = this.executeCustomValidators(control, this.value);
        }
        return validationResult;
    }

    protected createValidators(): void {
        this.heightValidators = [];
        this.heightValidators.push(this.createFootValidator());
        this.heightValidators.push(this.createInchValidator());
    }

    protected createFootValidator(): Validator {
        const self = this;
        const isFootValueValid = function(value: any): boolean {
            return self.isFootValueValid(value);
        };
        return ValidatorFactory.createHeightFootValidator(ValidatorTypes.HeightRange, isFootValueValid);
    }

    protected isFootValueValid(value: any): boolean {
        return true;
    }

    protected createInchValidator(): Validator {
        const self = this;
        const isInchValueValid = function(value: any): boolean {
            return self.isInchValueValid(value);
        };
        return ValidatorFactory.createHeightInchValidator(ValidatorTypes.HeightRange, isInchValueValid);
    }

    protected isInchValueValid(value: any): boolean {
        return !value[HeightPartNames.INCH] || this.validateHeightFormat(value[HeightPartNames.INCH]);
    }

    protected validateHeightFormat(valueInch: string): boolean {
        const inchReg: RegExp = /^((0?[0-9])|(1[0-1]))$/;
        return inchReg.test(valueInch);
    }

    protected get elementNames(): Array<string> {
        return [HeightPartNames.FT, HeightPartNames.INCH, HeightPartNames.CM];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: HeightPartNames.FT, type: 'number' },
            { name: HeightPartNames.INCH, type: 'number' },
            { name: HeightPartNames.CM, type: 'number', calculated: true }
        ];
    }

    protected initElementsData(): void {
        super.initElementsData();
        this.elementsDataArray.forEach(elementData => {
            elementData.regExp = /[0-9]/;
            elementData.type = 'text';
        });
    }

    protected updateElementsData(): void {
        this.elementsData[HeightPartNames.FT].elementRef = this.elementHeightFt;
        this.elementsData[HeightPartNames.INCH].elementRef = this.elementHeightInch;
        this.elementsData[HeightPartNames.CM].elementRef = this.elementHeightCm;
        super.updateElementsData();
    }

    public writeValue(value: any): void {
        this.value = {};
        this.value[HeightPartNames.FT] = MeasurementUtil.getFtFromHeight(value);
        this.value[HeightPartNames.INCH] = MeasurementUtil.getInchFromHeight(value);
        this.setCalculatedValue(false);
        this.updateElementValues();
    }

    protected adjustProperties(propertyChanged: ModelProperty, updateDisplay: boolean): void {
        if (propertyChanged.calculated) {
            this.adjustPropertyValue(this.getProperty(HeightPartNames.FT), updateDisplay);
            this.adjustPropertyValue(this.getProperty(HeightPartNames.INCH), updateDisplay);
        } else {
            this.setCalculatedValue(true);
        }
    }

    private adjustPropertyValue(property: ModelProperty, updateDisplay: boolean): void {
        const heightValueInch: number = this.getInchHeightFromCalculatedProperty();
        let newPropValue: any;
        if (property.name == HeightPartNames.FT) {
            newPropValue = MeasurementUtil.getFtFromHeight(heightValueInch);
        } else if (property.name == HeightPartNames.INCH) {
            newPropValue = MeasurementUtil.getInchFromHeight(heightValueInch);
        }
        this.setPropertyValue(this.value, property, newPropValue);
        if (updateDisplay) {
            this.updateElementValue(this.elementNames[this.getPropertyIndex(property)], newPropValue);
        }
    }

    protected getInchHeightFromCalculatedProperty(): number {
        const calculatedValue = this.calculatedValue[this.getCalculatedProperty().name];
        const heightValueCm: number = LangUtil.isNullOrEmptyString(calculatedValue) ? null : Number(calculatedValue);
        return MeasurementUtil.convertCmToInch(heightValueCm);
    }

    protected calculateCalculatedValue(): any {
        return MeasurementUtil.convertInchToCm(this.heightValueInch);
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

    public onBlur(event: Event): void {
        super.onBlur(event);
        this.onModelTouched();
        this.updateModel();
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
        this.onModelChange(this.heightValueInch);
    }

    protected get heightValueInch(): number {
        const heightFt = this.value[HeightPartNames.FT];
        const heightInch = this.value[HeightPartNames.INCH];
        return LangUtil.isNullOrEmptyString(heightFt) && LangUtil.isNullOrEmptyString(heightInch)
            ? null
            : MeasurementUtil.getHeight(Number(heightFt), Number(heightInch));
    }

    public get showCm(): boolean {
        return !this.elementsData[HeightPartNames.CM].hidden;
    }

    @Input()
    public set showCm(value: boolean) {
        this.elementsData[HeightPartNames.CM].hidden = !value;
    }
}
