import { Injector, Injectable } from '@angular/core';

import { NameUtil } from 'life-core/util';
import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class AgentNameResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let agentName = '';
        if (policy.Agents_LazyLoad && policy.Agents_LazyLoad.length > 0) {
            agentName = NameUtil.getFullName({
                firstName: policy.Agents_LazyLoad[0].FirstName,
                lastName: policy.Agents_LazyLoad[0].LastName
            });
        }
        return Promise.resolve(agentName);
    }
}
