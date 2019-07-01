import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class ReceivedRequirementsListResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    private MAX_RECEIVED_REQUIREMENTS_TO_DISPLAY: number;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
        this.MAX_RECEIVED_REQUIREMENTS_TO_DISPLAY = 2;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let retVal = '';
        const receivedRequirements = policy.Requirements_LazyLoad.filter(requirement => {
            return requirement.RequirementInformationId != null;
        });
        receivedRequirements.splice(0, this.MAX_RECEIVED_REQUIREMENTS_TO_DISPLAY).forEach(requirement => {
            const receivedRequirementMetaData = this.context['requirement'].find(
                requirementMetaData => requirementMetaData.value == requirement.RequirementCode
            );
            retVal += receivedRequirementMetaData.label;
            retVal += '<br />';
        });
        return Promise.resolve(retVal);
    }
}
