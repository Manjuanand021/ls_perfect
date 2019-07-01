import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class PolicyAssociationDescriptionResolver extends BaseDynamicFieldDataResolver<string> {
    public context: any;
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const associationMetaData: MetadataItem = this.context['association'].find(
            item => item.value === this._appSession.policyDTO.AssociationCode
        );
        const policyAssociationDescription = associationMetaData ? associationMetaData.label : '';
        return Promise.resolve(policyAssociationDescription);
    }
}
