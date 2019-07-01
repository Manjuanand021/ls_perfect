import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';

@Component({
    selector: 'lf-form-inputtaxid',
    template: `
        <lf-form-input [control]="formTaxIdField" [label]="config.label">
            <lf-inputtaxid
                #formTaxIdField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [attr.placeholder]="config.placeholder"
                [required]="config.required"
                [disabled]="config.disabled"
            >
            </lf-inputtaxid>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputTaxIdComponent extends AbstractDynamicFormInput {
    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
