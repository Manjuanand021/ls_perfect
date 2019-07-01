import { Component, Injector } from '@angular/core';

import { TertiaryTabHostViewModel } from 'life-core/component';

import { PolicySubscriber } from 'ls-core/session';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';

import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'mib-report',
    templateUrl: './mib-report.component.html',
    providers: [PolicySubscriber]
})
export class MIBReportComponent extends TertiaryTabHostViewModel<PolicyDataModel> {
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
