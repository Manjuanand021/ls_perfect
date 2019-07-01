import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class ApplicationTypeDescriptionResolver extends BaseDynamicFieldDataResolver<string> {
    public context: any;
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const applicationTypeMetaData: MetadataItem = this.context['ApplicationType'].find(
            item => item.value === this._appSession.policyDTO.ApplicationType
        );
        const applicationTypeDescription = applicationTypeMetaData ? applicationTypeMetaData.label : '';
        return Promise.resolve(applicationTypeDescription);
    }
}
