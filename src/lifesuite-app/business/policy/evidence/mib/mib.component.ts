import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicySubscriber } from 'ls-core/session';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { MibAuthorizationProvider } from './mib-authorization.provider';

@Component({
    selector: 'mib-tab',
    templateUrl: './mib.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: MibAuthorizationProvider }]
})
export class MIBTabComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
