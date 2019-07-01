import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputbankaccount',
    templateUrl: './test-inputbankaccount.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputBankAccount extends TestInputComponent {
    public maxLength: number = 20;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('srBankAccountField', '12345678'));
    }
}
