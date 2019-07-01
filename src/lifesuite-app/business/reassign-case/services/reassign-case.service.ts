import { Injector, Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

import { ReassignCasePagedDataRequest } from './reassign-case-paged-data-request.model';

@Injectable()
export class ReassignCasesService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public submitReassignCases(fromUser: number, toUser: number, policyIDs: number[]): Promise<boolean> {
        const serviceParams = this.getReassignCasesServiceParams(fromUser, toUser, policyIDs);
        return this._dataService
            .updateData(serviceParams)
            .then(response => {
                const reassignCasesResponse = <ReassignCasesResponse>response.responsePayload;
                const result = reassignCasesResponse && reassignCasesResponse.totalCasesAssigned > 0 ? true : false;
                return result;
            })
            .catch(response => {
                return false;
            });
    }

    public submitReassignAllCases(fromUser: number, toUser: number): Promise<boolean> {
        const serviceParams = this.getReassignAllServiceParams(fromUser, toUser);
        return this._dataService
            .updateData(serviceParams)
            .then(response => {
                const reassignCasesResponse = <ReassignCasesResponse>response.responsePayload;
                const result = reassignCasesResponse && reassignCasesResponse.totalCasesAssigned > 0 ? true : false;
                return result;
            })
            .catch(response => {
                return false;
            });
    }

    private getReassignCasesServiceParams(fromUser: number, toUser: number, policyIDs: number[]): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REASSIGN_CASES,
            serviceMethod: UIServiceMethods.REASSIGN_CASE,
            requestPayload: this.buildReassignCasesSubmitRequest(fromUser, toUser, policyIDs)
        });
    }

    private getReassignAllServiceParams(fromUser: number, toUser: number): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REASSIGN_ALL_CASES,
            serviceMethod: UIServiceMethods.REASSIGN_CASE,
            requestPayload: this.buildReassignAllSubmitRequest(fromUser, toUser)
        });
    }

    private buildReassignCasesSubmitRequest(
        fromUser: number,
        toUser: number,
        policyIDs: number[]
    ): ReassignCasesSubmitRequest {
        const request = new ReassignCasesSubmitRequest();
        request.casesList = policyIDs;
        request.fromUserId = fromUser;
        request.toUserId = toUser;
        return request;
    }

    private buildReassignAllSubmitRequest(fromUser: number, toUser: number): ReassignAllCasesSubmitRequest {
        const request = new ReassignAllCasesSubmitRequest();
        request.reassignPolicyPagedDataRequest = new ReassignCasePagedDataRequest({
            fromUserId: fromUser
        });
        request.toUserId = toUser;
        return request;
    }
}

class ReassignCasesSubmitRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ReassignCasesRequest, LifeSuite.UIServiceDTO';
    public casesList: number[];
    public fromUserId: number;
    public toUserId: number;
}

class ReassignAllCasesSubmitRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ReassignAllCasesRequest, LifeSuite.UIServiceDTO';
    public reassignPolicyPagedDataRequest: ReassignPolicyPagedDataRequest;
    public toUserId: number;
}

class ReassignCasesResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.ReassignCasesResponse, LifeSuite.UIServiceDTO';
    public totalCasesAssigned: number;
}

class ReassignPolicyPagedDataRequest {
    public readonly $type: string =
        'life.ls.ui.ria.dto.responses.ReassignPolicyPagedDataRequest, LifeSuite.UIServiceDTO';
    public fromUserId: number;
}
