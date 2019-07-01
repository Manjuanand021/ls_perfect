import { Injectable } from '@angular/core';

import { ListMap } from 'life-core/model';
import { BaseDTO } from 'ls-core/model';
import { ListDataService } from '../list-data/list-data.service';
import { ListDataRequestBuilder } from '../list-data/list-data-request.builder';
import {
    ListsDataRequest,
    ListDataResponses,
    ListDataResponse,
    ListDataItem,
    ListDataItems
} from '../list-data/list-data.model';

@Injectable()
export class ListDataUpdater {
    protected listDataService: ListDataService;

    constructor(listDataService: ListDataService) {
        this.listDataService = listDataService;
    }

    public updateListData(params: UpdateListDataParams): Promise<void> {
        const request = this.getListsDataRequest(params);
        return this.listDataService.load(request).then(data => {
            Object.assign(params.listData, data);
        });
    }

    protected getListsDataRequest(params: UpdateListDataParams): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(params.rootDTO);
        listDataRequestBuilder.addListRequestItem(params.currentDTO, params.dtoProperty);

        return listDataRequestBuilder.getRequest();
    }
}

export class UpdateListDataParams {
    public rootDTO: BaseDTO;

    public currentDTO: any;

    public dtoProperty: string;

    public listData: ListMap<ListDataItem>;

    constructor({
        rootDTO,
        currentDTO,
        dtoProperty,
        listData
    }: {
        rootDTO: BaseDTO;
        currentDTO: any;
        dtoProperty: string;
        listData: ListMap<ListDataItem>;
    }) {
        this.rootDTO = rootDTO;
        this.currentDTO = currentDTO;
        this.dtoProperty = dtoProperty;
        this.listData = listData;
    }
}
