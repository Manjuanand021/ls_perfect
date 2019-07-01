import { Component, ViewChild, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { FieldConfig } from '../model/field-config.interface';
import { FormFieldEvent } from '../event/dynamic-form.event';

@Component({
    selector: 'lf-form-checkbox',
    template: `
        <lf-form-input [control]="formCheckboxField" [label]="config.label">
            <lf-checkbox
                #formCheckboxField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [authorizationLevel]="authorizationLevel"
                [disabled]="config.disabled"
                (click)="onClick(config)"
            >
            </lf-checkbox>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormCheckboxComponent extends AbstractDynamicFormInput {
    @ViewChild(FormInput)
    public formInput: FormInput;
    @Output()
    public eventSource: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public onClick(fieldConfig: FieldConfig): void {
        if (this.needToRaiseChangeEvent()) {
            this.eventSource.emit(
                new FormFieldEvent({
                    name: fieldConfig.name,
                    value: this.data[this.config.dataProperty],
                    index: this.index
                })
            );
        }
    }
}
