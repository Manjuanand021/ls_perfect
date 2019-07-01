import { Injector, Injectable } from '@angular/core';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { ObjectUtil } from 'life-core/util/lang';
import { ListMap } from 'life-core/model';
import { BeneficiaryDTO } from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class BeneficiaryDialogDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    public getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        const beneficiaries = { PersonTypeId: null };
        const beneficiaryDTO = ObjectUtil.createObjectOfType(beneficiaries, BeneficiaryDTO);
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'PersonTypeId');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'RelationshipToInsuredCode');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'BeneficiaryType');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'Title');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'Suffix');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'BenefitType');
        return listDataRequestBuilder.getRequest();
    }
}
