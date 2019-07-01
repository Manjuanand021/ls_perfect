import { Component, EventEmitter, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AbstractDynamicFormInput } from './dynamic-form-input';
import { ListFieldConfig } from '../model/field-config.interface';
import { FormInput } from 'life-core/component/form';
import { FormFieldEvent } from '../event/dynamic-form.event';

@Component({
    selector: 'lf-form-select',
    template: `
        <lf-form-input [control]="formSelectField" [label]="config.label">
            <lf-select
                #formSelectField
                [name]="config.name + index"
                [(ngModel)]="data[config.dataProperty]"
                [items]="
                    isClearable && isSorted
                        ? (config.options | listItems: listLabelProperty:listValueProperty | emptyItem | sortList)
                        : isClearable
                        ? (config.options | listItems: listLabelProperty:listValueProperty | emptyItem)
                        : isSorted
                        ? (config.options | listItems: listLabelProperty:listValueProperty | sortList)
                        : (config.options | listItems: listLabelProperty:listValueProperty)
                "
                [authorizationLevel]="authorizationLevel"
                [required]="config.required"
                [disabled]="config.disabled"
                [clearable]="isClearable"
                [ngStyle]="config.style"
                (change)="onChange(config)"
            >
            </lf-select>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormSelectComponent extends AbstractDynamicFormInput {
    public config: ListFieldConfig;

    @ViewChild(FormInput)
    public formInput: FormInput;

    @Output()
    public eventSource: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    public listLabelProperty: string;
    public listValueProperty: string;

    public isClearable: boolean;
    public isSorted: boolean;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setListOptionProperties();
        this.setClearableProperty();
        this.setSortedProperty();
    }

    private setListOptionProperties(): void {
        this.listLabelProperty = this.config.listLabelProperty ? this.config.listLabelProperty : 'label';
        this.listValueProperty = this.config.listValueProperty ? this.config.listValueProperty : 'value';
    }

    protected setClearableProperty(): void {
        // default to true
        this.isClearable = this.config.clearable == undefined ? true : this.config.clearable;
    }

    protected setSortedProperty(): void {
        // default to true
        this.isSorted = true;
    }

    public onChange(fieldConfig: ListFieldConfig): void {
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
