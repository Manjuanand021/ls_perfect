import { Injectable } from '@angular/core';

import { ListMap } from 'life-core/model';

import { ListsDataRequest, ListDataRequestBuilder, ListDataService, ListDataItem } from 'ls-core/service';
import { LSSystemDTO } from 'ls-core/model';

@Injectable()
export class ReassignCaseListItemsDelegate {
    private _listDataService: ListDataService;

    constructor(listDataService: ListDataService) {
        this._listDataService = listDataService;
    }

    public getData(fromUserID: number): Promise<ListMap<ListDataItem>> {
        const request = this.getReassignToListsDataRequest(fromUserID);
        return this._listDataService.load(request);
    }

    private getReassignToListsDataRequest(fromUser: number): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        const lsSystem = new LSSystemDTO();
        lsSystem.userId = fromUser;
        listDataRequestBuilder.addListRequestItem(lsSystem, 'uwOrSaUserId');
        return listDataRequestBuilder.getRequest();
    }
}
