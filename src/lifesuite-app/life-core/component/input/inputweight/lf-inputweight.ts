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
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { LangUtil } from 'life-core/util/lang';
import { MeasurementUtil } from 'life-core/util/measurement';
import { LfCompositeInputComponent, ModelProperty } from '../shared/lf-composite-input.component';
import { SecureComponent } from '../../authorization';

export const INPUTWEIGHT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputWeight),
    multi: true
};

export const WeightPartNames = {
    LB: 'weightLb',
    KG: 'weightKg'
};

@Component({
    selector: 'lf-inputweight',
    templateUrl: './lf-inputweight.html',
    styleUrls: ['../shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUTWEIGHT_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LfInputWeight) }]
})
export class LfInputWeight extends LfCompositeInputComponent<any> implements ControlValueAccessor {
    @Input()
    public weightLbText: string = 'lbs';
    @Input()
    public weightKgText: string = 'kg';

    @ViewChild(WeightPartNames.LB)
    private elementWeightLb: ElementRef<HTMLInputElement>;
    @ViewChild(WeightPartNames.KG)
    private elementWeightKg: ElementRef<HTMLInputElement>;

    @ViewChild(WeightPartNames.LB)
    protected inputElement: ElementRef<HTMLInputElement>;

    private onModelChange: Function = () => {};
    private onModelTouched: Function = () => {};

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    protected get elementNames(): Array<string> {
        return [WeightPartNames.LB, WeightPartNames.KG];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: WeightPartNames.LB, type: 'number' },
            { name: WeightPartNames.KG, type: 'number', calculated: true }
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
        this.elementsData[WeightPartNames.LB].elementRef = this.elementWeightLb;
        this.elementsData[WeightPartNames.KG].elementRef = this.elementWeightKg;
        super.updateElementsData();
    }

    public writeValue(value: any): void {
        this.value = {};
        this.value[WeightPartNames.LB] = value;
        this.setCalculatedValue(false);
        this.updateElementValues();
    }

    protected adjustProperties(propertyChanged: ModelProperty, updateDisplay: boolean): void {
        if (propertyChanged.calculated) {
            this.adjustPropertyValue(this.getProperty(WeightPartNames.LB), updateDisplay);
        } else {
            this.setCalculatedValue(true);
        }
    }

    private adjustPropertyValue(property: ModelProperty, updateDisplay: boolean): void {
        let newPropValue: any;
        if (property.name == WeightPartNames.LB) {
            newPropValue = this.getLbWeightFromCalculatedProperty();
        }
        this.setPropertyValue(this.value, property, newPropValue);
        if (updateDisplay) {
            this.updateElementValue(this.elementNames[this.getPropertyIndex(property)], newPropValue);
        }
    }

    protected getLbWeightFromCalculatedProperty(): number {
        const calculatedValue = this.calculatedValue[this.getCalculatedProperty().name];
        const heightValueKg: number = LangUtil.isNullOrEmptyString(calculatedValue) ? null : Number(calculatedValue);
        return MeasurementUtil.convertKgToLb(heightValueKg);
    }

    protected calculateCalculatedValue(): any {
        return MeasurementUtil.convertLbToKg(this.weightValueLb);
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
        this.onModelChange(this.weightValueLb);
    }

    protected get weightValueLb(): number {
        const weightLb = this.value[WeightPartNames.LB];
        return LangUtil.isNullOrEmptyString(weightLb) ? null : Number(weightLb);
    }

    public get showKg(): boolean {
        return !this.elementsData[WeightPartNames.KG].hidden;
    }

    @Input()
    public set showKg(value: boolean) {
        this.elementsData[WeightPartNames.KG].hidden = !value;
    }
}
