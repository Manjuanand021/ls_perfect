import { Injectable } from '@angular/core';

import { ListMap } from 'life-core/model';
import { DataService } from '../data.service';
import { DataServiceParams } from '../data-service.model';
import { UIServiceNames, UIServiceMethods } from '../service-method-ids';
import { ListsDataRequest, ListDataResponses, ListDataItem } from './list-data.model';

/**
 *  ListDataService provides functionality to load list data
 */
@Injectable()
export class ListDataService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(request: ListsDataRequest): Promise<ListMap<ListDataItem>> {
        const serviceParams = this.getServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            return this.buildListsDataResult(response.responsePayload as ListDataResponses);
        });
    }

    private getServiceParams(request: ListsDataRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.LISTSDATA,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: request
        });
    }

    private buildListsDataResult(listDataResponses: ListDataResponses): ListMap<ListDataItem> {
        const result: ListMap<ListDataItem> = {};
        if (listDataResponses) {
            listDataResponses.responseList.forEach(listDataResponse => {
                listDataResponse.listItems.forEach(listDataItems => {
                    // result[listDataItem.propertyName] = this.createList(listDataItem.list);
                    result[listDataItems.propertyName] = listDataItems.list;
                });
            });
        }
        return result;
    }
}
