import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicySubscriber } from 'ls-core/session';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { MedicalConditionAuthorizationProvider } from './medical-condition-authorization.provider';

@Component({
    selector: 'medical-condition-tab',
    templateUrl: './medical-condition-tab.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: MedicalConditionAuthorizationProvider }]
})
export class MedicalConditionTabComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
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
