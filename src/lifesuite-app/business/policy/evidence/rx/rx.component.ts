import { Component, Injector, Injectable } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { AuthorizationProvider } from 'life-core/authorization';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { RxAuthorizationProvider } from './rx-authorization.provider';

@Component({
    selector: 'rx-tab',
    templateUrl: './rx.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: RxAuthorizationProvider }]
})
@Injectable()
export class RxTabComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
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
