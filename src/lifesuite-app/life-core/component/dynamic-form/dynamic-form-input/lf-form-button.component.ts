import { Component, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AbstractDynamicFormInput } from './dynamic-form-input';
import { FieldConfig } from '../model/field-config.interface';
import { FormFieldEvent } from '../event/dynamic-form.event';

@Component({
    selector: 'lf-form-button',
    template: `
        <div class="form-group">
            <lf-button
                [authorizationLevel]="authorizationLevel"
                [name]="config.name + index"
                [label]="config.label"
                [disabled]="config.disabled"
                (onClick)="onClick(config)"
            >
            </lf-button>
        </div>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormButtonComponent extends AbstractDynamicFormInput {
    @Output()
    public eventSource: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public onClick(fieldConfig: FieldConfig): void {
        this.eventSource.emit(new FormFieldEvent({ name: fieldConfig.name, index: this.index }));
    }
}
