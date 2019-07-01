import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';
import { DateRange } from 'life-core/component/input';

@Component({
    selector: 'test-inputdate',
    templateUrl: './test-inputdate.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestInputDate extends TestInputComponent {
    minDate: string = '1/1/2000';
    maxDate: string = '1/1/2020';
    daterange: DateRange;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        this.fieldDescriptors.push(
            TestInputsUtil.createDateFieldDescriptor(
                'dateField',
                new Date(Date.now()),
                new Date('1/1/2000'),
                new Date('1/1/2020')
            )
        );
        this.fieldDescriptors.push(
            TestInputsUtil.createDateFieldDescriptor(
                'srDateField',
                new Date(Date.now()),
                new Date('1/1/2000'),
                new Date('1/1/2020')
            )
        );
        this.fieldDescriptors.push(TestInputsUtil.createStringFieldDescriptor('stringDateField', '10/10/2010'));
        this.fieldDescriptors.push(
            TestInputsUtil.createDateFieldDescriptor(
                'lplaDateField',
                new Date(Date.now()),
                new Date('1/1/2000'),
                new Date('1/1/2020')
            )
        );
        this.daterange = { minDate: new Date('1/1/2000'), maxDate: new Date('1/1/2020') };
    }

    public onButtonResetClick(event: Event) {
        this.fields.srDateField.value = null;
        this.fields.stringDateField.value = null;
        this.fields.lplaDateField.value = null;
        this.daterange = null;
    }
}
