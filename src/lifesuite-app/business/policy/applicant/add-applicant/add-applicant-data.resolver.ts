import { Injectable, Injector } from '@angular/core';
// import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataCollectionNames, InsuredDTO, PolicyDTO } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { AppSession } from 'ls-core/session';

import { ApplicantListHelper, BasePolicyDataResolver } from 'business/policy/shared';

@Injectable()
export class AddApplicantDataResolver extends BasePolicyDataResolver {
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        this._appSession = appSession;
    }

    protected loadLazyData(): Promise<any> {
        const policy = this._appSession.policyDTO;
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.getActiveApplicant(policy), DataCollectionNames.Applications);
        return this.lazyDataLoader.load(request);
    }

    private getActiveApplicant(policy: PolicyDTO): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(policy.Insureds_LazyLoad);
    }
}
