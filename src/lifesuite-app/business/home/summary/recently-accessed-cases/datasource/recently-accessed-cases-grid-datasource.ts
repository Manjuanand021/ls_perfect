import { Injectable, Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { IDataGridContext, IInfiniteGridDatasource, GridState } from 'life-core/component/grid';

import {
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    PagedDataRequest,
    CompositeFilter
} from 'ls-core/service';
import { PolicyProxy } from 'ls-core/model';

import { SummaryFilterModel } from 'business/home/summary/filter/summary-filter.model';
import { BaseGridDataSource } from 'business/shared/grid';

import { RecentlyAccessedCasesFilterBuilder } from '../recently-accessed-cases-filter.builder';

@Injectable()
export class RecentlyAccessedCasesGridDataSource extends BaseGridDataSource implements IInfiniteGridDatasource {
    private _summaryFilterModel: SummaryFilterModel;
    private _recentlyAccessedCasesFilterBuilder: RecentlyAccessedCasesFilterBuilder;

    constructor(injector: Injector) {
        super(injector);
        this._recentlyAccessedCasesFilterBuilder = new RecentlyAccessedCasesFilterBuilder();
    }

    public updateFilter(summaryFilterModel: SummaryFilterModel): void {
        this._summaryFilterModel = summaryFilterModel;
    }

    public getRows(params: IGetRowsParams): void {
        const serviceParams: DataServiceParams = this.getRowsServiceParams(params);
        this.dataService.getData(serviceParams).then(response => {
            const rows = response.responsePayload ? (response.responsePayload as Array<PolicyProxy>) : [];
            params.successCallback(rows, rows.length);
            (params.context as IDataGridContext).hostComponent.onGetRowsComplete({
                gridState: new GridState({
                    sortModel: params.sortModel,
                    filterModel: params.filterModel
                }),
                rows: rows,
                rowCount: rows.length
            });
        });
    }

    protected getRowsServiceParams(params: IGetRowsParams): any {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.RECENT_POLICIES_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    // we do not need count here
    // not used
    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return null;
    }

    protected getFilterCriterion(): CompositeFilter {
        return this._recentlyAccessedCasesFilterBuilder.buildFilter(this._summaryFilterModel);
    }

    private getRowsPayLoad(params: IGetRowsParams): PagedDataRequest {
        const filterCriterion = this.getFilterCriterion();
        const numOfItems = params.endRow - params.startRow;
        const pagedDataRequest = new PagedDataRequest({
            startIndex: params.startRow,
            numItemsToFetch: numOfItems,
            filters: filterCriterion !== undefined ? filterCriterion.filters : []
        });
        return pagedDataRequest;
    }
}
