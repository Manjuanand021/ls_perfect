import { Injector, Injectable } from '@angular/core';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { ListMap } from 'life-core/model';
import { ListDataRequestBuilder, ListDataItem, ListsDataRequest } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class OtherInsuranceCasesDialogDataResolver extends BaseListDataResolver
    implements DirectDataResolverClass<ListMap<ListDataItem>> {
    public context: any;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    public getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        listDataRequestBuilder.addListRequestItem(this.context, 'Status');
        listDataRequestBuilder.addListRequestItem(this.context, 'LineOfBusiness');
        listDataRequestBuilder.addListRequestItem(this.context, 'PurposeOfCoverage');
        listDataRequestBuilder.addListRequestItem(this.context, 'ReplacementType');
        return listDataRequestBuilder.getRequest();
    }
}
