import { Injector, Injectable } from '@angular/core';

import { DirectDataResolve, DirectResolvedData, resolveData } from 'life-core/component/shared';
import { PolicyDTO, InsuredDTO, AgencyDTO } from 'ls-core/model';

import { ApplicantListHelper } from 'business/policy/shared';

export interface PolicyQuickInfoFormData {
    policy: PolicyDTO;
    insured: InsuredDTO;
    agency: AgencyDTO;
    resolvedData: DirectResolvedData;
}

@Injectable()
export class PolicyQuickInfoFormDataBuilder {
    private _injector: Injector;
    private _applicantListHelper: ApplicantListHelper;

    constructor(injector: Injector, applicantListHelper: ApplicantListHelper) {
        this._injector = injector;
        this._applicantListHelper = applicantListHelper;
    }

    public build(policy: PolicyDTO, resolveFieldDataMap?: Array<DirectDataResolve>): Promise<PolicyQuickInfoFormData> {
        return this.getResolvedData(resolveFieldDataMap).then(data => {
            return {
                policy: policy,
                insured: this.getActiveApplicant(policy),
                agency: policy.Agencies_LazyLoad[0],
                resolvedData: data
            };
        });
    }

    private getResolvedData(resolveFieldDataMap: Array<DirectDataResolve>): Promise<DirectResolvedData> {
        if (resolveFieldDataMap) {
            return resolveData(resolveFieldDataMap, this._injector).then(data => {
                return data;
            });
        }
        return Promise.resolve(null);
    }

    private getActiveApplicant(policy: PolicyDTO): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(policy.Insureds_LazyLoad);
    }
}
