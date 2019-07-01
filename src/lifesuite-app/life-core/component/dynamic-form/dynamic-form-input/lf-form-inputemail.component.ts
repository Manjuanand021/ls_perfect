import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';

@Component({
    selector: 'lf-form-inputemail',
    template: `
        <lf-form-input [control]="formEmailField" [label]="config.label">
            <lf-inputemail
                #formEmailField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [attr.placeholder]="config.placeholder"
                [required]="config.required"
                [disabled]="config.disabled"
            >
            </lf-inputemail>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputEmailComponent extends AbstractDynamicFormInput {
    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
