import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { DateFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-inputdaterange',
    template: `
        <lf-form-input [control]="formDateRangeField" [label]="config.label">
            <lf-inputdaterange
                #formDateRangeField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [required]="config.required"
                [disabled]="config.disabled"
            >
            </lf-inputdaterange>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputDateRangeComponent extends AbstractDynamicFormInput {
    public config: DateFieldConfig;
    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
