import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem, PolicyDTO } from 'ls-core/model';

import { RequirementStatuses } from 'business/policy/shared';

@Injectable()
export class OutstandingRequirementsListResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    private MAX_OUTSTANDING_REQUIREMENTS_TO_DISPLAY: number;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
        this.MAX_OUTSTANDING_REQUIREMENTS_TO_DISPLAY = 2;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let retVal = '';
        const outstandingRequirements = policy.Requirements_LazyLoad.filter(requirement => {
            return (
                requirement.ClosedDisposition == null || requirement.ClosedDisposition == RequirementStatuses.ORDERED
            );
        });

        outstandingRequirements.slice(0, this.MAX_OUTSTANDING_REQUIREMENTS_TO_DISPLAY).forEach(requirement => {
            const outstandingRequirementMetaData = this.context['requirement'].find(
                requirementMetaData => requirementMetaData.value == requirement.RequirementCode
            );
            retVal += outstandingRequirementMetaData.label;
            retVal += '<br />';
        });
        return Promise.resolve(retVal);
    }
}
