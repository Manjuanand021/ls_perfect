import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { PhoneModel } from 'life-core/component/input';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputphone',
    templateUrl: './test-inputphone.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputPhone extends TestInputComponent {
    lfPhoneValue: PhoneModel = { areaCode: '123', prefix: '456', suffix: '7890', ext: '1111' } as PhoneModel;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {}
}
