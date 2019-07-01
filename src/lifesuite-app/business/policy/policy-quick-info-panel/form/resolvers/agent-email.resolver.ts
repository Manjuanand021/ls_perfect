import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class AgentEmailResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let agentEmail = '';
        if (policy.Agents_LazyLoad && policy.Agents_LazyLoad.length > 0
            && policy.Agents_LazyLoad[0].EmailAddress != null) {
            agentEmail = policy.Agents_LazyLoad[0].EmailAddress;
        }
        return Promise.resolve(agentEmail);
    }
}