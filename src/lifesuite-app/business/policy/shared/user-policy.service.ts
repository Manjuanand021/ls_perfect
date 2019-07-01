import { Injector, Injectable } from '@angular/core';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

@Injectable()
export class UserPolicyService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public canUserApprovePolicy(policyPersonId: number, isUserID: boolean = false): Promise<boolean> {
        const serviceParams = this.canUserApprovePolicyServiceParams(policyPersonId, isUserID);
        return this.invokeService(serviceParams);
    }

    private invokeService(serviceParams: DataServiceParams): Promise<boolean> {
        return this._dataService.getData(serviceParams).then(response => {
            return response && response.responsePayload
                ? (response.responsePayload as boolean)
                : Promise.resolve(false);
        });
    }

    private canUserApprovePolicyServiceParams(policyPersonId: number, isUserID: boolean): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.POLICY,
            serviceMethod: UIServiceMethods.CAN_USER_APPROVE_POLICY,
            requestPayload: this.buildRequestPayload(policyPersonId, isUserID)
        });
    }

    private buildRequestPayload(policyPersonId: number, isUserID: boolean): UserApprovePolicyRequest {
        const request = new UserApprovePolicyRequest();
        request.dataId = policyPersonId.toString();
        request.isUserId = isUserID.toString();
        return request;
    }
}

class UserApprovePolicyRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.UserApprovePolicyRequest, LifeSuite.UIServiceDTO';
    public dataId: string;
    public isUserId: string;
}
