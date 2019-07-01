import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class ServiceAssociateResolver extends BaseDynamicFieldDataResolver<string> {
    private _appSession: AppSession;
    public context: any;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const policy = this._appSession.policyDTO;
        let serviceAssociateName: string;
        if (policy.ServiceAssociateId) {
            const serviceAssociateMetaData: MetadataItem = this.context['service_associate'].find(item => {
                item.value === policy.ServiceAssociateId.toString();
            });
            serviceAssociateName = serviceAssociateMetaData ? serviceAssociateMetaData.label : '';
        } else {
            serviceAssociateName = '';
        }
        return Promise.resolve(serviceAssociateName);
    }
}
