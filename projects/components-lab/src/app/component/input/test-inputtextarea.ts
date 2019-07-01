import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-inputtextarea',
    templateUrl: './test-inputtextarea.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputTextarea extends TestInputComponent {
    rows: number = 5;
    cols: number = 20;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('textareaField', 'textarea 1'));
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('srTextareaField', 'sr textarea 2'));
    }
}
