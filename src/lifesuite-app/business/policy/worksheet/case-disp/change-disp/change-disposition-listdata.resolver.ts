import { Injectable, Injector } from '@angular/core';

import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { AppSession } from 'ls-core/session';

@Injectable()
export class ChangeDispositionListDataResolver extends BaseListDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        listDataRequestBuilder.addListRequestItem(this._appSession.policyDTO, 'Disposition');
        listDataRequestBuilder.addListRequestItem(this._appSession.policyDTO, 'ReasonText');

        return listDataRequestBuilder.getRequest();
    }
}
