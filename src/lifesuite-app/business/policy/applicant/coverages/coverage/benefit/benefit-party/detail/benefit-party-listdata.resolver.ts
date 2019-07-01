import { Injector, Injectable } from '@angular/core';

import { DirectDataResolverClass } from 'life-core/component/shared';
import { ListMap } from 'life-core/model';
import { BenefitPartyDTO } from 'ls-core/model/dto';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class BenefitPartyListDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    private _appSession: AppSession;
    public context?: any;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    public getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        const benefitParty: BenefitPartyDTO = this.context as BenefitPartyDTO;
        listDataRequestBuilder.addListRequestItem(benefitParty, 'Sex');
        listDataRequestBuilder.addListRequestItem(benefitParty, 'RelationshipToInsuredCode');
        return listDataRequestBuilder.getRequest();
    }
}
