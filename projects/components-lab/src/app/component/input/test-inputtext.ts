import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputtext',
    templateUrl: './test-inputtext.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputText extends TestInputComponent {
    public maxLength: number = 20;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('textField', 'value 1'));
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('srTextField', 'sr value 2'));
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('lplaTextField', 'lpla value 3'));
    }
}
