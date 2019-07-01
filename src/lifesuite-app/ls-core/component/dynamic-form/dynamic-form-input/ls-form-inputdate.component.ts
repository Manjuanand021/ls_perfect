import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { LfFormInputDateComponent } from 'life-core/component/dynamic-form';

@Component({
    selector: 'ls-form-inputdate',
    template: `
        <lf-form-input [control]="formDateField" [label]="config.label">
            <ls-inputdate
                #formDateField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [minDate]="config.range?.min"
                [maxDate]="config.range?.max"
                [required]="config.required"
                [disabled]="config.disabled"
                [class]="config.cssClass"
            >
            </ls-inputdate>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LsFormInputDateComponent extends LfFormInputDateComponent {
    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
