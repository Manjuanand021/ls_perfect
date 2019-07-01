import { Injectable, Injector } from '@angular/core';

import { BenefitDTO, PolicyCoverageDTO } from 'ls-core/model';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session';
import { ListMap } from 'life-core/model';
import { DirectDataResolverClass } from 'life-core/component';

@Injectable()
export class AddBenefitListDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    private _appSession: AppSession;
    public context?: any;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const policyCoverage: PolicyCoverageDTO = this.context as PolicyCoverageDTO;
        // From LifeSuite 9.0
        // There is no suitable attribute available on BenefitDTO so use note for this purpose
        const benefit = new BenefitDTO();
        benefit.Note = policyCoverage.PlanCodeId;
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        listDataRequestBuilder.addListRequestItem(benefit, 'BenefitId');

        return listDataRequestBuilder.getRequest();
    }
}
