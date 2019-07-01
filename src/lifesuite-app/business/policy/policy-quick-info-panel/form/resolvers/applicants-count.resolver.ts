import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class ApplicantsCountResolver extends BaseDynamicFieldDataResolver<number> {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<number> {
        return Promise.resolve(this._appSession.policyDTO.Insureds_LazyLoad.length);
    }
}
