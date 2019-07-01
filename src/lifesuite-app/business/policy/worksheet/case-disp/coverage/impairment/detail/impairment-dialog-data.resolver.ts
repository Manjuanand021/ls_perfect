import { Injector, Injectable } from '@angular/core';

import { DirectDataResolverClass } from 'life-core/component/shared';
import { ObjectUtil } from 'life-core/util/lang';
import { ListMap } from 'life-core/model';
import { ImpairmentRestrictionDTO } from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class ImpairmentDialogDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    public context: any;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        const impairmentDTO = ObjectUtil.createObjectOfType(this.context, ImpairmentRestrictionDTO);
        listDataRequestBuilder.addListRequestItem(impairmentDTO, 'ImpairmentRestrictionCode');
        return listDataRequestBuilder.getRequest();
    }
}
