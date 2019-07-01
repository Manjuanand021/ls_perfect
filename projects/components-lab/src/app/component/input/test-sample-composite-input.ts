import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-sample-composite-input',
    templateUrl: './test-sample-composite-input.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestSampleCompositeInput extends TestInputComponent {
    compositeValue = { part1: '111', part2: '222' };

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {}
}
