import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';

@Component({
    selector: 'summary-tab',
    templateUrl: './summary.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class SummaryTabComponent extends SecondaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
