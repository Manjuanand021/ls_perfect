import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';

@Component({
    selector: 'policy-list-tab',
    templateUrl: './policy-list-tab.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class PolicyListTabComponent extends SecondaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
