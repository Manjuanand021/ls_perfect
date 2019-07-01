import { Component, Injector, Injectable } from '@angular/core';
import { ViewModel } from 'life-core/view-model';

import { PolicySubscriber } from 'ls-core/session';

import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'case-distribution',
    templateUrl: './case-distribution.component.html',
    providers: [PolicySubscriber]
})
@Injectable()
export class CaseDistributionComponent extends ViewModel<PolicyDataModel> {
    public numberRegex: RegExp = /[0-9]/;

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        return Promise.resolve();
    }
}
