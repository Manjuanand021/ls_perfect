import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-checkbox',
    templateUrl: './test-checkbox.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestCheckbox extends TestInputComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createBooleanFieldDescriptor('checkboxField', true, true));
        this.fieldDescriptors.push(TestInputsUtil.createBooleanFieldDescriptor('srCheckboxField', false, true));
    }
}
