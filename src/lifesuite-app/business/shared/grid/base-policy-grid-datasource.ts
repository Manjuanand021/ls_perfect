import { Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { PagedDataRequest } from 'ls-core/service';
import { BaseGridDataSource } from './base-grid-data-source';

export abstract class BasePolicyGridDataSource extends BaseGridDataSource {
    constructor(injector: Injector) {
        super(injector);
    }

    protected getRowsPayLoad(params: IGetRowsParams): PagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const numOfItems = params.endRow - params.startRow;
        const sortFields = this.getSortFieldsForSortModel(params.sortModel);
        return new PagedDataRequest({
            startIndex: params.startRow,
            numItemsToFetch: numOfItems,
            sortFields: sortFields,
            filters: filterCriterion !== undefined ? filterCriterion.filters : []
        });
    }

    protected getRowCountPayLoad(params: IGetRowsParams): PagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        return new PagedDataRequest({
            filters: filterCriterion !== undefined ? filterCriterion.filters : []
        });
    }
}
