import { Injector, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ViewModel } from 'life-core/view-model';
import { FormInput, FormErrors } from 'life-core/component/form';
import { DynamicFormComponent } from '../dynamic-form.component';
import { FieldConfig } from '../model/field-config.interface';
import { FormLayoutConfig } from '../model/layout-config.interface';
import { FormFieldEvent } from '../event/dynamic-form.event';
import { DirectResolvedData } from 'life-core/component';
import { Logger, ILogger } from 'life-core/logging';
import { FormDependentFieldEvent } from '../event/dynamic-form.event';
import { FormFieldsUtil } from '../util';
import { DependentFieldHandlerRegistry } from '../dependent-field/dependent-field-handler.registry';

export abstract class DynamicFormViewModel extends ViewModel {
    @ViewChildren(DynamicFormComponent)
    public dynamicForms: QueryList<DynamicFormComponent>;

    public layoutConfig: FormLayoutConfig;

    public formData: Object;

    public formFields: Array<FieldConfig>;

    public resolvedData: DirectResolvedData;

    public rootForm: NgForm;

    protected dependentFieldHandlerRegistry: DependentFieldHandlerRegistry;

    private _logger: ILogger;

    constructor(injector: Injector) {
        super(injector);
        this.dependentFieldHandlerRegistry = new DependentFieldHandlerRegistry();
        this._logger = injector.get(Logger);
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setRootForm();
        this.initFormData();
        this.setupDependentFieldHandlerRegistry();
    }

    protected initFormData(): void {
        this.setFormData();
        this.setFormFields().then(() => {
            this.preprocessFormFields();
        });
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.setupSubscriptions();
    }

    protected abstract setFormData(): void;

    protected abstract setFormFields(): Promise<void>;

    protected preprocessFormFields(): Promise<void> {
        return Promise.resolve();
    }

    // Overrides base class method
    public getFormInputs(): Array<FormInput> {
        const formInputs = super.getFormInputs();
        this.dynamicForms.forEach(dynamicForm => {
            formInputs.push(...dynamicForm.formInputs);
        });
        return formInputs;
    }

    // Overrides base class method
    protected updateFormErrors(formErrors: FormErrors): void {
        super.updateFormErrors(formErrors);
        this.dynamicForms.forEach(dynamicForm => {
            dynamicForm.updateFormErrors(formErrors);
        });
    }

    private setRootForm(): void {
        this.rootForm = this.getRootForm();
    }

    protected setupSubscriptions(): void {
        this.dynamicForms.forEach(dynamicForm => {
            this.subscriptionTracker.track([
                dynamicForm.formFieldEvent.subscribe(event => {
                    this.onFormFieldEvent(event);
                }),
                dynamicForm.formDependentFieldEvent.subscribe(event => {
                    this.onFormDependentFieldEvent(event);
                })
            ]);
        });
    }

    protected onFormFieldEvent(event: FormFieldEvent): void {
        // Override to handle custom events from dynamic form controls
        this._logger.log('onFormFieldEvent:', event);
    }

    protected onFormDependentFieldEvent(event: FormDependentFieldEvent): void {
        const depFieldHandlerRegistryItem = this.dependentFieldHandlerRegistry.get(event.dependentFieldName);
        const handler = this.injector.get(depFieldHandlerRegistryItem.handlerClass, null);
        if (handler) {
            handler.execute({
                dependentField: this.getFormFieldByName(event.dependentFieldName),
                triggerField: this.getFormFieldByName(event.triggerFieldName),
                triggerFieldValue: event.triggerFieldValue,
                formFields: this.formFields,
                formData: this.formData,
                additionalContext: depFieldHandlerRegistryItem.additionalContext
            });
        }
    }

    protected copyFormFields(formFields: Array<FieldConfig>): Array<FieldConfig> {
        return formFields.map(formField => {
            return this.cloneFormField(formField);
        });
    }

    protected cloneFormField(formField: FieldConfig): FieldConfig {
        return { ...formField };
    }

    protected getFormFieldByName(fieldName: string): FieldConfig {
        return FormFieldsUtil.getFormFieldByName(this.formFields, fieldName);
    }

    protected setupDependentFieldHandlerRegistry(): void {
        // Override to setup dependent field handlers
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.dependentFieldHandlerRegistry.destroy();
    }
}
