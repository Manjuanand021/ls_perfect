import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { DateFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-inputdate',
    template: `
        <lf-form-input [control]="formDateField" [label]="config.label">
            <lf-inputdate
                #formDateField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [minDate]="config.range?.min"
                [maxDate]="config.range?.max"
                [required]="config.required"
                [disabled]="config.disabled"
            >
            </lf-inputdate>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputDateComponent extends AbstractDynamicFormInput {
    public config: DateFieldConfig;

    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
