import { Injectable, Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { IInfiniteGridDatasource } from 'life-core/component/grid';

import { DataServiceParams, UIServiceNames, UIServiceMethods, CompositeFilter } from 'ls-core/service';

import { BaseGridDataSource } from 'business/shared/grid/base-grid-data-source';

import { CaseLogFilterModel } from '../filter/case-log-filter.model';
import { LogEntryPagedRequest } from './log-entry-paged-request.service';

@Injectable()
export class CaseLogListGridDataSource extends BaseGridDataSource implements IInfiniteGridDatasource {
    private _caseLogListFilterModel: CaseLogFilterModel;

    constructor(injector: Injector, caseLogFilterModel: CaseLogFilterModel) {
        super(injector);
        this._caseLogListFilterModel = caseLogFilterModel;
    }

    public updateFilter(caseLogListFilterModel: CaseLogFilterModel): void {
        this._caseLogListFilterModel = caseLogListFilterModel;
        this.resetRowCount();
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.LOG_ENTRY_LISTDATA,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.LOG_ENTRY_COUNT_LISTDATA,
            serviceMethod: UIServiceMethods.GET_COUNT,
            requestPayload: this.getRowCountPayLoad(params)
        });
    }

    private getRowsPayLoad(params: IGetRowsParams): LogEntryPagedRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const sortFields = this.getSortFieldsForSortModel(params.sortModel);
        const numOfItems = params.endRow - params.startRow;
        const request = this.buildRequestPayload(filterCriterion);
        request.startIndex = params.startRow;
        request.numItemsToFetch = numOfItems;
        request.sortFields = sortFields;
        return request;
    }

    private getRowCountPayLoad(params: IGetRowsParams): LogEntryPagedRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        return this.buildRequestPayload(filterCriterion);
    }

    private buildRequestPayload(filterCriterion: CompositeFilter): LogEntryPagedRequest {
        const request = new LogEntryPagedRequest({
            policyId: this._caseLogListFilterModel.policyId,
            applicantId: this._caseLogListFilterModel.applicantId,
            filters: filterCriterion ? filterCriterion.filters : []
        });
        return request;
    }
}
