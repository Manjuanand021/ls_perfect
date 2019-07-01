﻿import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class UnderwriterResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        const underwriterMetaData: MetadataItem = this.context['underwriter'].find(
            item => item.value === policy.UnderwriterId.toString()
        );
        const underwriterName = underwriterMetaData ? underwriterMetaData.label : '';
        return Promise.resolve(underwriterName);
    }
}
