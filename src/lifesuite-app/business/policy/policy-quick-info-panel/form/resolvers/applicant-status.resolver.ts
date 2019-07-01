import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

import { PrimaryInsuredHelper } from 'business/policy/shared';

@Injectable()
export class ApplicantStatusResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        const primaryInsured = PrimaryInsuredHelper.getPrimaryInsured(policy);
        const applicantStatus = primaryInsured.ApplicantStatus;
        const applicantStatusMetaData: MetadataItem = this.context['applicant_status'].find(
            item => item.value === applicantStatus
        );
        const applicantStatusDescription = applicantStatusMetaData ? applicantStatusMetaData.label : '';
        return Promise.resolve(applicantStatusDescription);
    }
}
