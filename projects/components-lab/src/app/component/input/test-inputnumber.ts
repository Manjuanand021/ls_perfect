import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputnumber',
    templateUrl: './test-inputnumber.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputNumber extends TestInputComponent {
    public maxNumber: number = 5000;
    public minNumber: number = 1;

    localeId: string = 'en-US';
    localeId2: string = 'en-US';

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createNumericFieldDescriptor('numericField', 1000, 1, 1000, true, 2));
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('srNumericDecField', 1000, 1, 1000, true, 2)
        );
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('srNumericIntField', 35, 1, 99, true, 0)
        );
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('lplaNumericField', 1000.12, 1, 3000, true, 2)
        );
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('newNumericField', 2000.34, 1000, 5000, true, 2)
        );
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('newNumericField2', 1234.56, 1, 2000, true, 2)
        );
    }
}
