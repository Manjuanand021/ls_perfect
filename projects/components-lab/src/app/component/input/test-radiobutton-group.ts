import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-radiobutton-group',
    templateUrl: './test-radiobutton-group.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestRadioButtonGroup extends TestInputComponent {
    options: Array<{ label: string; value: boolean }> = [
        { label: 'Option [true]', value: true },
        { label: 'Option [false]', value: false }
    ];

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(TestInputsUtil.createNumericFieldDescriptor('radioButtonField', 1, 0, 2, true, 0));
        this.fieldDescriptors.push(TestInputsUtil.createBooleanFieldDescriptor('boolRadioButtonField', true, true));
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('strRadioButtonField', 'b'));
        this.fieldDescriptors.push(
            TestInputsUtil.createNumericFieldDescriptor('numRadioButtonField', null, 0, 2, true, 0)
        );
    }

    onRadioGroupChange(event: Event): void {
        console.debug('radiogroup value changed to: ', this.fields['boolRadioButtonField'].value);
    }
}
