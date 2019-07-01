import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { PolicyProxy } from 'ls-core/model';

import { RelatedPolicyHelper } from 'business/policy/shared';

@Injectable()
export class RelatedPoliciesCountResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    private _relatedPolicyHelper: RelatedPolicyHelper;

    constructor(relatedPolicyHelper: RelatedPolicyHelper, appSession: AppSession) {
        super();
        this._relatedPolicyHelper = relatedPolicyHelper;
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        return this.getRelatedPolicies().then(data => {
            const relatedPolicies = data as [PolicyProxy];
            return this.getUniquePolicyCount(relatedPolicies);
        });
    }

    private getUniquePolicyCount(relatedPolicies: PolicyProxy[]): number {
        const policyNumbers = relatedPolicies.map(policy => policy.PolicyNumber);
        const uniquePolicySet = new Set<string>([...policyNumbers]);
        return uniquePolicySet.size;
    }

    private getRelatedPolicies(): any {
        const policy = this._appSession.policyDTO;
        return this._relatedPolicyHelper.getRelatedPolicies(policy);
    }
}
