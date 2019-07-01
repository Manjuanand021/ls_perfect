import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { ListFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-listvaluelabel',
    template: `
        <lf-form-input [control]="formListValueLabelField" [label]="config.label">
            <lf-listvaluelabel
                #formListValueLabelField
                [name]="config.name + index"
                [authorizationLevel]="authorizationLevel"
                [value]="data[config.dataProperty]"
                [options]="config.options | listItems: listLabelProperty:listValueProperty"
            >
            </lf-listvaluelabel>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormListValueLabelComponent extends AbstractDynamicFormInput {
    public config: ListFieldConfig;
    @ViewChild(FormInput)
    public formInput: FormInput;

    public listLabelProperty: string;

    public listValueProperty: string;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setListOptionProperties();
    }

    private setListOptionProperties(): void {
        this.listLabelProperty = this.config.listLabelProperty ? this.config.listLabelProperty : 'label';
        this.listValueProperty = this.config.listValueProperty ? this.config.listValueProperty : 'value';
    }
}
