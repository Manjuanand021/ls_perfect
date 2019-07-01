import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';

@Component({
    selector: 'lf-form-inputtextarea',
    template: `
        <lf-form-input [control]="formTextareaField" [label]="config.label">
            <lf-inputtextarea
                #formTextareaField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [attr.placeholder]="config.placeholder"
                [required]="config.required"
                [disabled]="config.disabled"
                [style]="config.style"
            >
            </lf-inputtextarea>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputTextareaComponent extends AbstractDynamicFormInput {
    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
