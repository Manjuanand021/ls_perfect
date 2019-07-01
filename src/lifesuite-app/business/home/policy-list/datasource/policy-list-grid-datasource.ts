import { Injectable, Injector } from '@angular/core';
import { IGetRowsParams } from 'ag-grid-community';

import { IInfiniteGridDatasource } from 'life-core/component/grid';

import { DataServiceParams, UIServiceNames, UIServiceMethods, CompositeFilter } from 'ls-core/service';
import { BasePolicyGridDataSource } from 'business/shared/grid/base-policy-grid-datasource';

import { PolicyListFilterBuilder } from '../filter/policy-list-filter-builder';
import { PolicyListFilterModel } from '../filter/policy-list-filter-model';

@Injectable()
export class PolicyListGridDataSource extends BasePolicyGridDataSource implements IInfiniteGridDatasource {
    private _policyListFilterBuilder: PolicyListFilterBuilder;
    private _policyListFilterModel: PolicyListFilterModel;

    constructor(injector: Injector, policyListFilterBuilder: PolicyListFilterBuilder) {
        super(injector);
        this._policyListFilterBuilder = policyListFilterBuilder;
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.WORK_ITEMS_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    protected getExternalFilters(): CompositeFilter {
        return this._policyListFilterBuilder.buildPolicyListFilter(this._policyListFilterModel);
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.WORK_ITEMS_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_COUNT,
            requestPayload: this.getRowCountPayLoad(params)
        });
    }

    public updateFilter(policyListFilterModel: PolicyListFilterModel): void {
        this._policyListFilterModel = policyListFilterModel;
        this.resetRowCount();
    }
}
