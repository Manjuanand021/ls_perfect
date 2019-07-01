import { Injectable, Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { ConvertUtil } from 'life-core/util/lang';
import { IInfiniteGridDatasource } from 'life-core/component/grid';

import { DataServiceParams, UIServiceNames, UIServiceMethods, CompositeFilter } from 'ls-core/service';
import { BaseGridDataSource } from 'business/shared/grid/base-grid-data-source';

import { ReassignCaseFilterModel } from '../filter/reassign-case-filter.model';
import { ReassignCasePagedDataRequest } from '../services/reassign-case-paged-data-request.model';

@Injectable()
export class ReassignCaseGridDataSource extends BaseGridDataSource implements IInfiniteGridDatasource {
    private _reassignCaseFilterModel: ReassignCaseFilterModel;

    constructor(injector: Injector) {
        super(injector);
    }

    public updateFilter(reassignCaseFilterModel: ReassignCaseFilterModel): void {
        this.setReassignCaseFilterModel(reassignCaseFilterModel);
        this.resetRowCount();
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REASSIGN_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REASSIGN_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_COUNT,
            requestPayload: this.getRowCountPayLoad(params)
        });
    }

    private setReassignCaseFilterModel(reassignCaseFilterModel: ReassignCaseFilterModel): void {
        this._reassignCaseFilterModel = reassignCaseFilterModel;
    }

    private getRowsPayLoad(params: IGetRowsParams): ReassignCasePagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const numOfItems = params.endRow - params.startRow;
        const request = this.buildRequestPayload(filterCriterion);
        const sortFields = this.getSortFieldsForSortModel(params.sortModel);
        request.startIndex = params.startRow;
        request.numItemsToFetch = numOfItems;
        request.sortFields = sortFields;
        return request;
    }

    private getRowCountPayLoad(params: IGetRowsParams): ReassignCasePagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        return this.buildRequestPayload(filterCriterion);
    }

    private buildRequestPayload(filterCriterion: CompositeFilter): ReassignCasePagedDataRequest {
        const request = new ReassignCasePagedDataRequest({
            fromUserId: ConvertUtil.toNumber(this._reassignCaseFilterModel.fromUser),
            filters: filterCriterion ? filterCriterion.filters : []
        });
        return request;
    }
}
