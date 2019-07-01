import { Injector, Injectable } from '@angular/core';

import { BaseDynamicFieldDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { MetadataItem, CoverageDTO } from 'ls-core/model';

import { PrimaryInsuredHelper } from 'business/policy/shared';

@Injectable()
export class LineofBusinessDescriptionResolver extends BaseDynamicFieldDataResolver<string> {
    public context: any;
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected resolveValue(): Promise<string> {
        const primaryInsured = PrimaryInsuredHelper.getPrimaryInsured(this._appSession.policyDTO);
        const coverage: CoverageDTO = primaryInsured.Coverages_LazyLoad[0];
        const lineofBusinessMetaData: MetadataItem = this.context['plan_code'].find(
            item => item.value === coverage.PlanCodeId
        );
        const lineofBusinessDescription = lineofBusinessMetaData ? lineofBusinessMetaData.externalCode : '';
        return Promise.resolve(lineofBusinessDescription);
    }
}
