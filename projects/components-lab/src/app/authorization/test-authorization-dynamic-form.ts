import { Component, Injector, Injectable, SkipSelf, Optional } from '@angular/core';

import { LsDynamicFormViewModel } from 'ls-core/component/dynamic-form';
import { FormLayoutConfig, FormFieldEvent, FieldConfig } from 'life-core/component/dynamic-form';
import { AuthorizationLevel, AuthorizationProvider } from 'life-core/authorization';
import { formData1 } from '../component/dynamic-form/dynamic-form.data';

@Injectable()
export class DynamicFormAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.componentLevel['firstname'] = AuthorizationLevel.VIEW;
        this.authorizationData.componentLevel['lastname'] = AuthorizationLevel.VIEW;
    }
}

@Component({
    selector: 'test-authorization-dynamic-form',
    template: `
        <div>Dynamic Form 1</div>
        <dynamic-form
            index="1"
            [formFields]="formFields"
            [formData]="formData1"
            [layoutConfig]="layoutConfig"
            [form]="rootForm"
            secureComponent
        >
        </dynamic-form>
    `,
    providers: [{ provide: AuthorizationProvider, useClass: DynamicFormAuthorizationProvider }]
})
export class TestAuthorizationDynamicForm extends LsDynamicFormViewModel {
    layoutConfig: FormLayoutConfig = {
        fieldsPerRow: 3
    };

    formData1: Object;

    constructor(injector: Injector) {
        super(injector);
    }

    protected setFormData(): void {
        this.formData1 = formData1;
    }

    protected setFormFields(): Promise<void> {
        this.formFields = this.routerAccessor.getDataFromRoute<Array<Array<FieldConfig>>>('formFields')[0];
        return Promise.resolve();
    }

    protected onFormFieldEvent(event: FormFieldEvent): void {
        alert(`${event.name} from Form index ${event.index}`);
    }
}
