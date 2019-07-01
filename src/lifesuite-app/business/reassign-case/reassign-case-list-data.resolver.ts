import { Injector, Injectable } from '@angular/core';

import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { BaseListDataResolver } from 'ls-core/view-model';
import { LSSystemDTO } from 'ls-core/model';

@Injectable()
export class ReassignFromUserResolver extends BaseListDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    public getListsDataRequest(): ListsDataRequest {
        const lsSystem = new LSSystemDTO();
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.addListRequestItem(lsSystem, 'userId');
        return listDataRequestBuilder.getRequest();
    }
}
