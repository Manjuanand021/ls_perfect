import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class TPANameResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        const tpaMetaData: MetadataItem = this.context['tpa_name'].find(item => item.value === policy.TpaCode);
        const tpaName = tpaMetaData ? tpaMetaData.value : '';
        return Promise.resolve(tpaName);
    }
}
