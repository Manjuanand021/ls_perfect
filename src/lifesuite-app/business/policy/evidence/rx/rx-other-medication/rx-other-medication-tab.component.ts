import { Component, Injector } from '@angular/core';

import { TertiaryTabHostViewModel } from 'life-core/component/layout/tabview';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: '',
    templateUrl: './rx-other-medication-tab.component.html',
    providers: [PolicySubscriber]
})
export class RxOtherMedicationTabComponent extends TertiaryTabHostViewModel<PolicyDataModel> {
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
