import { Injector, Injectable } from '@angular/core';
import { ObjectUtil } from 'life-core/util/lang';
import { MedicationDTO } from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';

@Injectable()
export class MedicalConditionListDataResolver extends BaseListDataResolver {
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
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'Condition');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'Criteria');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'TimeOfCriteria');
        listDataRequestBuilder.addListRequestItem(medicationDTO, 'Points');
        return listDataRequestBuilder.getRequest();
    }
}
