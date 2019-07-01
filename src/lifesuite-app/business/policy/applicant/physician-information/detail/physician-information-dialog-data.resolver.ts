import { Injector, Injectable } from '@angular/core';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { ObjectUtil } from 'life-core/util/lang';
import { ListMap } from 'life-core/model';
import { AddressDTO } from 'ls-core/model/dto';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class PhysicianInformationDialogDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    public getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        const addressDTO = ObjectUtil.createObjectOfType({ CountryId: null }, AddressDTO);
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryId');
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryStateId');
        return listDataRequestBuilder.getRequest();
    }
}
