import { Injectable, Injector } from '@angular/core';

import { ListMap } from 'life-core/model';
import { DirectDataResolverClass } from 'life-core/component/shared/data-resolve';
import { CoverageDTO } from 'ls-core/model';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session';

@Injectable()
export class ChangeCoverageDispositionListDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    private _appSession: AppSession;
    public context?: any;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        const coverage = this.context as CoverageDTO;
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        listDataRequestBuilder.addListRequestItem(coverage, 'CoverageStatus');
        listDataRequestBuilder.addListRequestItem(coverage, 'ReasonText');

        return listDataRequestBuilder.getRequest();
    }
}
