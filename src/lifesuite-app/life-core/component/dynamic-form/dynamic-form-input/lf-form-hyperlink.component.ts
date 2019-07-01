import { Component, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AbstractDynamicFormInput } from './dynamic-form-input';
import { FieldConfig } from '../model/field-config.interface';
import { FormFieldEvent } from '../event/dynamic-form.event';

@Component({
    selector: 'lf-form-hyperlink',
    template: `
        <div class="form-group">
            <lf-hyperlink
                [authorizationLevel]="authorizationLevel"
                [name]="config.name + index"
                [value]="config.value"
                [disabled]="config.disabled"
                (click)="onClick(config)"
            >
            </lf-hyperlink>
        </div>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormHyperlinkComponent extends AbstractDynamicFormInput {
    @Output()
    public eventSource: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public onClick(fieldConfig: FieldConfig): void {
        this.eventSource.emit(new FormFieldEvent({ name: fieldConfig.name, index: this.index }));
    }
}
