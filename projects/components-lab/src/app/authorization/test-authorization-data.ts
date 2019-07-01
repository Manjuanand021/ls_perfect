import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';

@Component({
    selector: 'test-authorization-data',
    templateUrl: './test-authorization-data.html'
})
export class TestAuthorizationData extends ViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
