import { Input, ChangeDetectorRef } from '@angular/core';

import { ElementRef, AfterViewInit } from '@angular/core';

import { LfInputComponent } from './lf-input.component';
import { InputUtil } from '../shared/input.util';
import { LangUtil } from 'life-core/util/lang';

/**
 *  Base class for composite input components, such as InputPhone.
 */
export abstract class LfCompositeInputComponent<T> extends LfInputComponent<T> implements AfterViewInit {
    /**
     *  Maps element names to ElementData.
     *  Each ElementData corresponds to a element
     *  of the composite component.
     */
    public elementsData: ElementDataMap = {};

    /**
     *  Holds calculated part of the value model.
     *  For example, may hold weight(kg) for Weight component saved in lbs.
     */
    protected calculatedValue: any = {};

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
        this.initElementsData();
    }

    public ngAfterViewInit(): void {
        this.updateElementsData();
    }

    /**
     *  Names of composite component elements.
     */
    protected abstract get elementNames(): Array<string>;

    /**
     *  Property names of model value object.
     */
    protected abstract get modelProperties(): Array<ModelProperty>;

    /**
     *  Property names of model value object.
     */
    protected get modelPropertyNames(): Array<string> {
        return this.modelProperties.map(modelProperty => {
            return modelProperty.name;
        });
    }

    protected initElementsData(): void {
        this.elementNames.forEach(elementName => {
            this.elementsData[elementName] = new ElementData({ hidden: false, disabled: false });
        });
    }

    protected updateElementsData(): void {
        this.setHtmlElementProperties();
    }

    private setHtmlElementProperties(): void {
        this.elementNames.forEach(elementName => {
            const elementData = this.elementsData[elementName];
            if (elementData && elementData.elementRef) {
                const nativeElement = elementData.elementRef.nativeElement;
                nativeElement.name = elementName;
            }
        });
        this.autocomplete = false;
    }

    public onDisabledChange(): void {
        this.elementsDataArray.forEach(elementData => {
            elementData.disabled = this.disabled;
        });
        super.onDisabledChange();
    }

    public onHiddenChange(): void {
        this.elementsDataArray.forEach(elementData => {
            elementData.hidden = this.hidden;
        });
        super.onHiddenChange();
    }

    @Input()
    public set autocomplete(value: boolean) {
        this.elementNames.forEach(elementName => {
            const elementData = this.elementsData[elementName];
            if (elementData && elementData.elementRef) {
                this.setAutocompleteValue(elementData.elementRef.nativeElement, value);
            }
        });
    }

    protected get elementsDataArray(): Array<ElementData> {
        return Object.keys(this.elementsData).map(elementName => {
            return this.elementsData[elementName];
        });
    }

    protected getElementRef(elementName: string): ElementRef<HTMLInputElement> {
        const elementData = this.elementsData[elementName];
        return elementData ? elementData.elementRef : undefined;
    }

    protected updateElementValues(): void {
        const properties = this.modelProperties;
        this.elementNames.forEach((elementName, index) => {
            const property = properties[index];
            const updateValue = property.calculated
                ? this.getPropertyValue(this.calculatedValue, property)
                : this.getPropertyValue(this.value, property);
            this.updateElementValue(elementName, updateValue);
        });
    }

    protected updateElementValue(elementName: string, value: any): void {
        const elementRef = this.getElementRef(elementName);
        if (elementRef) {
            elementRef.nativeElement.value = LangUtil.isDefined(value) ? value : '';
        }
    }

    // Event handlers
    public onFocus(event: Event): void {
        if (this.readonly) {
            return;
        }
        const elementName = (<HTMLInputElement>event.currentTarget).name;
        this.elementsData[elementName].focused = true;
        this.focused = true;
    }

    public onBlur(event: Event): void {
        const elementName = (<HTMLInputElement>event.currentTarget).name;
        this.elementsData[elementName].focused = false;
        setTimeout(_ => {
            if (!this.anyPartFocused()) {
                this.focused = false;
            }
        }, 0);
    }

    private anyPartFocused(): boolean {
        return this.elementNames.findIndex(elementName => this.elementsData[elementName].focused) >= 0;
    }

    public onKeyUp(event: KeyboardEvent): void {
        const htmlElement = event.currentTarget as HTMLInputElement;
        if (this.isValidCharCode(htmlElement, event.keyCode)) {
            if (htmlElement.value.length == htmlElement.maxLength) {
                this.tabToNextInput(htmlElement);
            }
        }
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (InputUtil.ignoreKeyPress(event)) {
            return;
        }
        const htmlElement = event.currentTarget as HTMLInputElement;
        if (!this.isValidCharCode(htmlElement, event.charCode)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }

    public onChange(event: Event): void {
        const element = <HTMLInputElement>event.target;
        const elementIndex = this.elementNames.indexOf(element.name);
        const changedProperty = this.modelProperties[elementIndex];
        if (changedProperty.calculated) {
            this.setPropertyValue(this.calculatedValue, changedProperty, element.value);
        } else {
            this.setPropertyValue(this.value, changedProperty, element.value);
        }
        this.adjustProperties(changedProperty, true);
    }

    /**
     *  Gets property value from a value object.
     *  Override this method if component has multiple properties stored in a single value,
     *  e.g. Height(ft) and Height(inch) stored as Inches.
     */
    protected getPropertyValue(valueObj: any, property: ModelProperty): any {
        return valueObj[property.name];
    }

    /**
     *  Sets property value to a value object.
     *  Override this method if component has multiple properties stored in a single value.
     */
    protected setPropertyValue(valueObj: any, property: ModelProperty, newValue: any): void {
        valueObj[property.name] = newValue;
    }

    /**
     *  Override this method to adjust the rest of the properties based on the changed property.
     */
    protected adjustProperties(propertyChanged: ModelProperty, updateDisplay: boolean): void {}

    // Calculated Property
    protected getCalculatedProperty(): ModelProperty {
        return this.modelProperties.find(prop => prop.calculated == true);
    }

    protected anyCalculatedProperties(): boolean {
        return this.getCalculatedProperty() != undefined;
    }

    protected setCalculatedValue(updateDisplay: boolean): void {
        this.calculatedValue[this.getCalculatedProperty().name] = this.calculateCalculatedValue();
        if (updateDisplay) {
            this.updateCalculatedElementValue();
        }
    }

    protected updateCalculatedElementValue(): void {
        this.modelProperties.forEach((property, index) => {
            if (property.calculated) {
                this.updateElementValue(this.elementNames[index], this.calculatedValue[property.name]);
            }
        });
    }

    protected calculateCalculatedValue(): any {}

    // Utility functions
    protected getProperty(propertyName: string): ModelProperty {
        return this.modelProperties.find(prop => prop.name == propertyName);
    }

    protected getPropertyIndex(property: ModelProperty): number {
        return this.modelProperties.findIndex(prop => prop.name == property.name);
    }

    protected isValueEmpty(): boolean {
        return !this.modelPropertyNames.some(propertyName => {
            return this.value[propertyName] && this.value[propertyName].length > 0;
        });
    }

    private tabToNextInput(currentElement: HTMLInputElement): void {
        const nextElement = this.getNextElement(currentElement);
        if (nextElement) nextElement.focus();
    }

    private getNextElement(currentElement: HTMLInputElement): HTMLInputElement {
        const currentIndex = this.elementIndex(currentElement);
        return this.getNextVisibleElement(currentIndex + 1);
    }

    private getNextVisibleElement(startIndex: number): HTMLInputElement {
        for (let i = startIndex; i < this.elementNames.length; i++) {
            const elementData = this.elementsData[this.elementNames[i]];
            if (!elementData.hidden) {
                return elementData.elementRef.nativeElement;
            }
        }
        return undefined;
    }

    protected isLastElement(element: HTMLInputElement): boolean {
        const currentIndex = this.elementIndex(element);
        return this.getNextVisibleElement(currentIndex + 1) == undefined;
    }

    protected isValidCharCode(element: HTMLInputElement, charCode: number): boolean {
        const regExp = this.elementsData[element.name].regExp;
        return regExp ? regExp.test(String.fromCharCode(charCode)) : true;
    }

    protected elementIndex(element: HTMLInputElement): number {
        return this.elementNames.findIndex(elementName => element.name == elementName);
    }
}

export type ElementDataMap = { [elementName: string]: ElementData };

export class ElementData {
    public elementRef?: ElementRef<HTMLInputElement>;
    public type: ElementType;
    public hidden?: boolean;
    public disabled?: boolean;
    public masked?: boolean;
    public alwaysMasked: boolean;
    public regExp?: RegExp;
    public placeholder?: string;
    public focused?: boolean;

    constructor({
        elementRef,
        hidden,
        disabled,
        masked,
        alwaysMasked,
        regExp,
        placeholder
    }: {
        elementRef?: ElementRef<HTMLInputElement>;
        hidden?: boolean;
        disabled?: boolean;
        masked?: boolean;
        alwaysMasked?: boolean;
        regExp?: RegExp;
        placeholder?: string;
    }) {
        this.elementRef = elementRef;
        this.hidden = hidden;
        this.disabled = disabled;
        this.masked = masked;
        this.alwaysMasked = alwaysMasked;
        this.regExp = regExp;
        this.placeholder = placeholder || '';
    }
}

export interface ModelProperty {
    name: string;
    type: PropertyType;
    // Indicates property is part of calculatedValue.
    calculated?: boolean;
}

export type PropertyType = 'string' | 'number' | 'date';

export type ElementType = 'text' | 'date' | 'password';
