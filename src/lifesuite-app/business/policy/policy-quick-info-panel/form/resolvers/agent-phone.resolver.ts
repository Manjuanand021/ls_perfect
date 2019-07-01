import { Injector, Injectable } from '@angular/core';

import { PhoneUtil } from 'ls-core/util';
import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { PhoneTypes } from 'ls-core/model';

@Injectable()
export class AgentPhoneResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let agentPhone = '';
        if (
            policy.Agents_LazyLoad &&
            policy.Agents_LazyLoad.length > 0 &&
            policy.Agents_LazyLoad[0].Phones_LazyLoad.length > 0
        ) {
            const phone = PhoneUtil.getPhone(policy.Agents_LazyLoad[0].Phones_LazyLoad, PhoneTypes.WORK);
            if (phone && phone.AreaCode) {
                agentPhone = PhoneUtil.getPhoneString(phone);
            }
        }
        return Promise.resolve(agentPhone);
    }
}
