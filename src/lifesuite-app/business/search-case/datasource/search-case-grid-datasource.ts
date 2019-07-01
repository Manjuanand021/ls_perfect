import { Injectable, Injector } from '@angular/core';
import { IGetRowsParams } from 'ag-grid-community';

import { IInfiniteGridDatasource } from 'life-core/component/grid';

import { DataServiceParams, UIServiceNames, UIServiceMethods, CompositeFilter } from 'ls-core/service';
import { PolicyByProductProxyDTO } from 'ls-core/model';

import { BasePolicyGridDataSource } from 'business/shared/grid/base-policy-grid-datasource';

import { SearchCaseCriteriaBuilder } from '../criteria/search-case-criteria.builder';

@Injectable()
export class SearchCaseGridDataSource extends BasePolicyGridDataSource implements IInfiniteGridDatasource {
    private _searchCaseCriteriaBuilder: SearchCaseCriteriaBuilder;
    private _policyByProductProxyDTO: PolicyByProductProxyDTO;

    constructor(injector: Injector) {
        super(injector);
        this._searchCaseCriteriaBuilder = new SearchCaseCriteriaBuilder();
    }

    public updateFilter(policyByProductProxyDTO: PolicyByProductProxyDTO): void {
        this._policyByProductProxyDTO = policyByProductProxyDTO;
        this.resetRowCount();
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SEARCH_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    protected getExternalFilters(): CompositeFilter {
        return this._searchCaseCriteriaBuilder.buildSearchCaseCriteria(this._policyByProductProxyDTO);
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SEARCH_POLICY_LIST,
            serviceMethod: UIServiceMethods.GET_POLICY_LIST_COUNT,
            requestPayload: this.getRowCountPayLoad(params)
        });
    }
}
