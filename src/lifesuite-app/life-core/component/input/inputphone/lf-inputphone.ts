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

import { LfCompositeInputComponent, ModelProperty } from '../shared/lf-composite-input.component';
import { SecureComponent } from '../../authorization';

export const INPUTPHONE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputPhone),
    multi: true
};

export const INPUTPHONE_PROVIDERS: Array<Provider> = [];

export const PhonePartNames = {
    AREA_CODE: 'areaCode',
    PREFIX: 'prefix',
    SUFFIX: 'suffix',
    EXT: 'ext'
};

@Component({
    selector: 'lf-inputphone',
    templateUrl: './lf-inputphone.html',
    styleUrls: ['../shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTPHONE_VALUE_ACCESSOR,
        ...INPUTPHONE_PROVIDERS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputPhone) }
    ]
})
export class LfInputPhone extends LfCompositeInputComponent<any> implements ControlValueAccessor {
    @ViewChild(PhonePartNames.AREA_CODE)
    private elementAreaCode: ElementRef<HTMLInputElement>;
    @ViewChild(PhonePartNames.PREFIX)
    private elementPrefix: ElementRef<HTMLInputElement>;
    @ViewChild(PhonePartNames.SUFFIX)
    private elementSuffix: ElementRef<HTMLInputElement>;
    @ViewChild(PhonePartNames.EXT)
    private elementExt: ElementRef<HTMLInputElement>;

    @Input()
    public extText: string = 'Ext';

    private onModelChange: Function = () => {};
    private onModelTouched: Function = () => {};

    @ViewChild(PhonePartNames.AREA_CODE)
    protected inputElement: ElementRef<HTMLInputElement>;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    protected get elementNames(): Array<string> {
        return [PhonePartNames.AREA_CODE, PhonePartNames.PREFIX, PhonePartNames.SUFFIX, PhonePartNames.EXT];
    }

    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: PhonePartNames.AREA_CODE, type: 'string' },
            { name: PhonePartNames.PREFIX, type: 'string' },
            { name: PhonePartNames.SUFFIX, type: 'string' },
            { name: PhonePartNames.EXT, type: 'string' }
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
        this.elementsData[PhonePartNames.AREA_CODE].elementRef = this.elementAreaCode;
        this.elementsData[PhonePartNames.PREFIX].elementRef = this.elementPrefix;
        this.elementsData[PhonePartNames.SUFFIX].elementRef = this.elementSuffix;
        this.elementsData[PhonePartNames.EXT].elementRef = this.elementExt;
        super.updateElementsData();
    }

    public writeValue(value: any): void {
        this.value = value || {};
        this.updateElementValues();
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
        this.onModelChange(!this.isValueEmpty() ? this.value : null);
    }

    // public handleInputChange(event) {
    // 	if (this.readonly) {
    // 		return;
    // 	}
    // 	this.updateModel(event);
    // }

    public get areaCodeHidden(): boolean {
        return this.elementsData[PhonePartNames.AREA_CODE].hidden;
    }
    @Input()
    public set areaCodeHidden(value: boolean) {
        this.elementsData[PhonePartNames.AREA_CODE].hidden = value;
    }

    public get extHidden(): boolean {
        return this.elementsData[PhonePartNames.EXT].hidden;
    }
    @Input()
    public set extHidden(value: boolean) {
        this.elementsData[PhonePartNames.EXT].hidden = value;
    }
}
