import { Injectable, Injector } from '@angular/core';

import { PolicyProxy } from 'ls-core/model';

import { RelatedPolicyHelper } from 'business/policy/shared';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class RelatedCasesDataResolver extends BaseViewDataResolver {
    protected _relatedPoliciesHelper: RelatedPolicyHelper;
    private _appSession: AppSession;

    constructor(injector: Injector, relatedPolicyHelper: RelatedPolicyHelper, appSession: AppSession) {
        super(injector);
        this._relatedPoliciesHelper = relatedPolicyHelper;
        this._appSession = appSession;
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<PolicyProxy[]> {
        return this._relatedPoliciesHelper.getRelatedPolicies(this._appSession.policyDTO);
    }
}
