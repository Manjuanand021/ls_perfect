import { Component, Injector } from '@angular/core';

import { LsDynamicFormViewModel } from 'ls-core/component/dynamic-form';
import { FormLayoutConfig, FormFieldEvent, FieldConfig } from 'life-core/component/dynamic-form';
import { formData1, formData2, PolicyData } from './dynamic-form.data';
import { SampleDependentFieldHandler } from './sample-dependent-field.handler';
import { DBDate } from 'ls-core/model';
import { DateRange } from 'life-core/component/input';

@Component({
    selector: 'test-child-form-view',
    template: `
        <div>
            Child view
            <lf-form-input label="Child view Field" [control]="childTextField">
                <lf-inputtext
                    #childTextField
                    name="childTextField"
                    [(ngModel)]="childTextFieldModel"
                    required
                ></lf-inputtext>
            </lf-form-input>
            <div style="border: 1px solid; margin: 10px;">
                Dynamic Form 1
                <dynamic-form
                    index="1"
                    [formFields]="formFields"
                    [formData]="formData1"
                    [layoutConfig]="layoutConfig1"
                    [form]="rootForm"
                >
                </dynamic-form>
                {{ formData1 | json }}
                <br />
                <lf-button label="Reset View" styleClass="btn" (onClick)="resetDynamicForm1($event)"></lf-button>
            </div>
            <div style="border: 1px solid; margin: 10px;">
                Dynamic Form 2
                <dynamic-form
                    index="2"
                    [formFields]="formFields"
                    [formData]="formData2"
                    [layoutConfig]="layoutConfig2"
                    [form]="rootForm"
                >
                </dynamic-form>
                {{ formData2 | json }}
            </div>
        </div>
    `
})
export class TestChildFormView extends LsDynamicFormViewModel {
    layoutConfig1: FormLayoutConfig = {
        fieldsPerRow: 4
    };

    layoutConfig2: FormLayoutConfig = {
        fieldsPerRow: 3
    };

    childTextFieldModel: string = '123';

    formData1: Object;
    formData2: Object;

    constructor(injector: Injector) {
        super(injector);
    }

    protected setFormData(): void {
        this.formData1 = formData1;
        this.formData2 = formData2;
    }

    protected setFormFields(): Promise<void> {
        this.formFields = this.routerAccessor.getDataFromRoute<Array<Array<FieldConfig>>>('formFields')[0];
        this.disableDynamicFields(['firstname', 'lastname']);
        return Promise.resolve();
    }

    private disableDynamicFields(fieldNames: Array<string>): void {
        const fields = this.formFields.filter(field => fieldNames.indexOf(field.name) >= 0);
        fields.forEach(field => (field.disabled = true));
    }

    protected onFormFieldEvent(event: FormFieldEvent): void {
        alert(`DynamicFieldEvent: '${event.name}' value='${event.value}' from Form index ${event.index}`);
    }

    protected setupDependentFieldHandlerRegistry(): void {
        this.dependentFieldHandlerRegistry.set('status', SampleDependentFieldHandler);
    }

    public resetDynamicForm1(event: any): void {
        this.formData1 = {
            policy: {},
            applicant: {},
            system: {}
        };
    }
}
