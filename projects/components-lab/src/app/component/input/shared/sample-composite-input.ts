import {
    Component,
    Input,
    ElementRef,
    forwardRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { LfCompositeInputComponent, ModelProperty } from 'life-core/component/input';

export class CompositePartNames {
    static PART1: string = 'part1';
    static PART2: string = 'part2';
    static CALCULATED_PART: string = 'calculatedpart';
}

export const COMPOSITE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SampleCompositeInput),
    multi: true
};

@Component({
    selector: 'sample-composite-input',
    template: `
		<fieldset [disabled]="disabled" [hidden]="hidden" [class.disabled]="disabled">
			<div class="lf-composite">
				<div class="lf-part">
					<input #part1 [type]="elementsData.part1.type" [ngClass]="'ui-inputtext ui-widget ui-state-default ui-corner-all'" maxlength="3" size="3" [placeholder]="elementsData.part1.placeholder"
						   (change)="onChange($event)"
						   (keyup)="onKeyUp($event)" (keypress)="onKeyPress($event)"
						   (focus)="onFocus($event)" (blur)="onBlur($event)"
						   [disabled]="elementsData.part1.disabled">
				</div>
				<div class="lf-part-spacer"></div>
				<div class="lf-part">
					<input #part2 [type]="elementsData.part2.type" [ngClass]="'ui-inputtext ui-widget ui-state-default ui-corner-all'" maxlength="3" size="3" [placeholder]="elementsData.part2.placeholder"
							(change)="onChange($event)"
							(keyup)="onKeyUp($event)" (keypress)="onKeyPress($event)"
							(focus)="onFocus($event)" (blur)="onBlur($event)"
							[disabled]="elementsData.part2.disabled">
				</div>
				<div *ngIf="!elementsData.calculatedpart.hidden" class="lf-part-spacer"></div>
				<div *ngIf="!elementsData.calculatedpart.hidden" class="lf-part">
					<input #calculatedpart [type]="elementsData.calculatedpart.type" [ngClass]="'ui-inputtext ui-widget ui-state-default ui-corner-all'" maxlength="4" size="4" [placeholder]="elementsData.calculatedpart.placeholder"
						   (change)="onChange($event)"
						   (keyup)="onKeyUp($event)" (keypress)="onKeyPress($event)"
						   (focus)="onFocus($event)" (blur)="onBlur($event)"
						   [disabled]="elementsData.calculatedpart.disabled">
				</div>
			</div>
		</fieldset>
		`,
    styles: [
        `
            .lf-composite {
                display: flex;
                align-items: center;
            }
            .lf-part-spacer {
                width: 0.3em;
            }
        `
    ],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [COMPOSITE_VALUE_ACCESSOR]
})
export class SampleCompositeInput extends LfCompositeInputComponent<any> implements ControlValueAccessor {
    @ViewChild(CompositePartNames.PART1)
    elementPart1: ElementRef<HTMLInputElement>;
    @ViewChild(CompositePartNames.PART2)
    elementPart2: ElementRef<HTMLInputElement>;
    @ViewChild(CompositePartNames.CALCULATED_PART)
    elementCalculatedPart: ElementRef<HTMLInputElement>;

    onModelChange: Function = () => {};
    onModelTouched: Function = () => {};

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    protected get elementNames(): Array<string> {
        return [CompositePartNames.PART1, CompositePartNames.PART2, CompositePartNames.CALCULATED_PART];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: CompositePartNames.PART1, type: 'number' },
            { name: CompositePartNames.PART2, type: 'number' },
            { name: CompositePartNames.CALCULATED_PART, type: 'number', calculated: true }
        ];
    }

    protected initElementsData(): void {
        super.initElementsData();
        this.elementsDataArray.forEach(elementData => {
            elementData.type = 'text';
            elementData.regExp = /[0-9]/;
        });
    }

    protected updateElementsData(): void {
        this.elementsData[CompositePartNames.PART1].elementRef = this.elementPart1;
        this.elementsData[CompositePartNames.PART2].elementRef = this.elementPart2;
        this.elementsData[CompositePartNames.CALCULATED_PART].elementRef = this.elementCalculatedPart;
        super.updateElementsData();
    }

    public writeValue(value: any): void {
        this.value = value || {};
        if (value) {
            this.setCalculatedValue(false);
            this.updateElementValues();
        }
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

    protected adjustProperties(propertyChanged: ModelProperty, updateDisplay: boolean) {
        if (propertyChanged.calculated) {
            this.adjustPropertyValue(this.getProperty(CompositePartNames.PART1), true);
            this.adjustPropertyValue(this.getProperty(CompositePartNames.PART2), true);
        } else {
            this.setCalculatedValue(true);
        }
    }

    private adjustPropertyValue(property: ModelProperty, updateDisplay: boolean): void {
        const calculatedValue = this.calculatedValue[this.getCalculatedProperty().name];
        let newPropValue: any;
        // For testing purposes, make Part1 value = CalculatedValue + 1, and Part2 = CalculatedValue + 2
        if (property.name == CompositePartNames.PART1) {
            newPropValue = calculatedValue ? (parseInt(calculatedValue) + 1).toString() : null;
        } else if (property.name == CompositePartNames.PART2) {
            newPropValue = calculatedValue ? (parseInt(calculatedValue) + 2).toString() : null;
        }
        this.setPropertyValue(this.value, property, newPropValue);
        if (updateDisplay) {
            this.updateElementValue(this.elementNames[this.getPropertyIndex(property)], newPropValue);
        }
    }

    protected calculateCalculatedValue(): any {
        // For testing purposes, make Calculated value equal to sum of parts' values
        const part1Value = this.value[CompositePartNames.PART1] ? parseInt(this.value[CompositePartNames.PART1]) : null;
        const part2Value = this.value[CompositePartNames.PART2] ? parseInt(this.value[CompositePartNames.PART2]) : null;
        let calculatedValue: number;
        if (part1Value != null && part2Value != null) {
            calculatedValue = part1Value + part2Value;
        } else if (part1Value != null) {
            calculatedValue = part1Value;
        } else if (part2Value != null) {
            calculatedValue = part2Value;
        }
        return calculatedValue;
    }

    public onBlur(event) {
        super.onBlur(event);
        this.onModelTouched();
        this.updateModel();
    }

    public onKeyDown(event) {
        if (this.readonly) {
            return;
        }
    }

    public onKeyPress(event) {
        if (this.readonly) {
            return;
        }
        super.onKeyPress(event);
    }

    public updateModel() {
        this.onModelChange(!this.isValueEmpty() ? this.value : null);
    }

    get calculatedPartHidden(): boolean {
        return this.elementsData[CompositePartNames.CALCULATED_PART].hidden;
    }
    @Input()
    set calculatedPartHidden(value: boolean) {
        this.elementsData[CompositePartNames.CALCULATED_PART].hidden = value;
    }
}
