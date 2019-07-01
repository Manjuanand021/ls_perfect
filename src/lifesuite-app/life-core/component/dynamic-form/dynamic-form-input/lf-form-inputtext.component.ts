import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';

@Component({
    selector: 'lf-form-inputtext',
    template: `
        <lf-form-input [control]="formTextField" [label]="config.label">
            <lf-inputtext
                #formTextField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [attr.placeholder]="config.placeholder"
                [required]="config.required"
                [disabled]="config.disabled"
                [class]="config.cssClass"
            >
            </lf-inputtext>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputTextComponent extends AbstractDynamicFormInput {
    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
