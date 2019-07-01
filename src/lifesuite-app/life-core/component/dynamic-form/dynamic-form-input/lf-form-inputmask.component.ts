import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { MaskFieldConfig } from '../model/field-config.interface';

@Component({
    selector: 'lf-form-inputmask',
    template: `
        <lf-form-input [control]="formMaskField" [label]="config.label">
            <lf-inputmask
                #formMaskField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [required]="config.required"
                [disabled]="config.disabled"
                [mask]="config.mask"
            >
            </lf-inputmask>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormInputMaskComponent extends AbstractDynamicFormInput {
    public config: MaskFieldConfig;

    @ViewChild(FormInput)
    public formInput: FormInput;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
