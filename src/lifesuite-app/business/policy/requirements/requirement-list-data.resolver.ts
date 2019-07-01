import { Injectable, Injector } from '@angular/core';

import { RequirementDTO, AddressDTO } from 'ls-core/model';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { AppSession } from 'ls-core/session';

@Injectable()
export class RequirementListDataResolver extends BaseListDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        this.addRequirementCodeDataListRequest(listDataRequestBuilder);
        return listDataRequestBuilder.getRequest();
    }

    private addRequirementCodeDataListRequest(listDataRequestBuilder: ListDataRequestBuilder): void {
        listDataRequestBuilder.addListRequestItem(new RequirementDTO(), 'RequirementCode');
        listDataRequestBuilder.addListRequestItem(new AddressDTO(), 'CountryId');
    }
}
