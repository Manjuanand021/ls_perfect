import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputmask',
    templateUrl: './test-inputmask.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputMask extends TestInputComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('phoneField', '123456789'));
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('srPhoneField', '987654321'));
    }
}
