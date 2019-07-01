import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { NumberFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-inputnumber',
    template: `
        <lf-form-input [control]="formNumberField" [label]="config.label">
            <lf-inputnumber
                #formNumberField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [required]="config.required"
                [disabled]="config.disabled"
                [format]="config.format"
                [decimals]="config.decimals"
                [allowNegative]="config.allowNegative"
                [min]="config.range?.min"
                [max]="config.range?.max"
                [maxLength]="config.maxLength"
                [class]="config.cssClass"
            >
            </lf-inputnumber>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputNumberComponent extends AbstractDynamicFormInput {
    public config: NumberFieldConfig;

    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
