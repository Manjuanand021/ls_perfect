import { Injector, Injectable } from '@angular/core';
import { ObjectUtil } from 'life-core/util/lang';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { ListMap } from 'life-core/model';
import { MedicationDTO } from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class MedicalConditionDetailDataResolver extends BaseListDataResolver
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
        const medicationDTO = ObjectUtil.createObjectOfType(this.context, MedicationDTO);
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'BodilySystem');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'Condition');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'Criteria');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'TimeOfCriteria');
        return listDataRequestBuilder.getRequest();
    }
}
