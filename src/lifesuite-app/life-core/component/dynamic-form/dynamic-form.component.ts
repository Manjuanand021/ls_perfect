import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChildren,
    AfterViewInit,
    QueryList,
    forwardRef,
    OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormInput, FormErrors } from 'life-core/component/form';
import { DirectResolvedData } from 'life-core/component/shared';
import { AuthorizationLevel } from 'life-core/authorization';
import { FieldConfig } from './model/field-config.interface';
import { FormLayoutConfig } from './model/layout-config.interface';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { DynamicFormLayout } from './dynamic-form-layout';
import { ISecureComponent, SecureComponent } from '../authorization';
import { FormFieldEvent, FormDependentFieldEvent } from './event/dynamic-form.event';
import { FormFieldsUtil } from './util';

@Component({
    exportAs: 'dynamicForm',
    selector: 'dynamic-form',
    templateUrl: 'dynamic-form.component.html',
    styleUrls: ['dynamic-form.component.css'],
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => DynamicFormComponent) }]
})
export class DynamicFormComponent implements OnInit, OnDestroy, AfterViewInit, ISecureComponent {
    @Input()
    public name: string;

    @Input()
    public formData: Object;

    @Input()
    public resolvedData: DirectResolvedData;

    @Input()
    public layoutConfig: FormLayoutConfig;

    @Input()
    public form: NgForm;

    @Input()
    public index: string;

    @Output()
    public formFieldEvent: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    @Output()
    public formDependentFieldEvent: EventEmitter<FormDependentFieldEvent> = new EventEmitter<FormDependentFieldEvent>();

    @ViewChildren(forwardRef(() => DynamicFieldDirective))
    public dynamicFields: QueryList<DynamicFieldDirective>;

    public formInputs: Array<FormInput>;

    public layout: DynamicFormLayout;

    private _formFields: FieldConfig[] = [];

    public ngOnInit(): void {
        this.createLayout();
    }

    public ngAfterViewInit(): void {
        this.setFormInputs();
        this.updateControlsInNgForm();
    }

    public set authorizationLevel(value: AuthorizationLevel) {
        // this._authorizationLevel = value;
        // this.updateHidden(this._hidden);
    }

    public updateFormErrors(formErrors: FormErrors): void {
        this.formInputs.forEach(formInput => {
            formInput.formErrors = formErrors;
        });
    }

    public get formFields(): FieldConfig[] {
        return this._formFields;
    }

    @Input()
    public set formFields(formFields: FieldConfig[]) {
        this._formFields = formFields;
        this.updateFieldConfigs();
    }

    private updateFieldConfigs(): void {}

    private createLayout(): void {
        this.layout = new DynamicFormLayout(this.layoutConfig);
        this.layout.calculate();
    }

    private setFormInputs(): void {
        const formInputs: Array<FormInput> = [];
        this.dynamicFields.forEach(dynamicField => {
            const formInput = this.getFormInput(dynamicField);
            if (formInput) {
                formInputs.push(formInput);
            }
        });
        this.formInputs = formInputs;
    }

    private updateControlsInNgForm(): void {
        this.formInputs.forEach(formInput => {
            if (formInput.ngModel) {
                this.form.addControl(formInput.ngModel);
            }
        });
    }

    private getFormInput(dynamicField: DynamicFieldDirective): FormInput {
        return dynamicField.component.instance.formInput;
    }

    public onFieldEvent(event: FormFieldEvent): void {
        const fieldConfig = this.formFields.find(formField => formField.name == event.name);
        if (fieldConfig.raiseEvent || this.alwaysRaiseEvent(fieldConfig)) {
            this.emitFieldEvent(event);
        }
        if (fieldConfig.dependentFields && fieldConfig.dependentFields.length > 0) {
            this.emitDependentFieldEvent(event);
        }
    }

    private emitFieldEvent(event: FormFieldEvent): void {
        this.formFieldEvent.emit(event);
    }

    private emitDependentFieldEvent(event: FormFieldEvent): void {
        const dependentFields = this.getDependentFieldsOf(event.name);
        if (dependentFields) {
            dependentFields.forEach(dependentField => {
                this.formDependentFieldEvent.emit(
                    new FormDependentFieldEvent({
                        dependentFieldName: dependentField.name,
                        triggerFieldName: event.name,
                        triggerFieldValue: event.value
                    })
                );
            });
        }
    }

    private getDependentFieldsOf(fieldName: string): FieldConfig[] {
        const field = FormFieldsUtil.getFormFieldByName(this.formFields, fieldName);
        return field.dependentFields.map(dependentFieldName => {
            return FormFieldsUtil.getFormFieldByName(this.formFields, dependentFieldName);
        });
    }

    private alwaysRaiseEvent(fieldConfig: FieldConfig): boolean {
        return ['button', 'hyperlink'].indexOf(fieldConfig.type) >= 0;
    }

    public ngOnDestroy(): void {
        this.formInputs.forEach(formInput => {
            if (formInput.ngModel) {
                this.form.removeControl(formInput.ngModel);
            }
        });
    }
}
