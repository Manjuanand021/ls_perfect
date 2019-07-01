import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { RadioButtonGroupFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-radiobuttongroup',
    template: `
        <lf-form-input [control]="formRadioButtonGroupField" [label]="config.label">
            <lf-radiobuttongroup
                #formRadioButtonGroupField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [required]="config.required"
                [disabled]="config.disabled"
            >
                <span>
                    <lf-radiobutton
                        *ngFor="let option of config.options"
                        [name]="config.name + index"
                        [value]="option.value"
                        [label]="option.label"
                    >
                    </lf-radiobutton>
                </span>
            </lf-radiobuttongroup>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormRadioButtonGroupComponent extends AbstractDynamicFormInput {
    public config: RadioButtonGroupFieldConfig;

    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
