import { Injectable, Injector } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

@Injectable()
export class UnderwriteService {
    private _dataService: DataService;
    private _appSession: AppSession;

    constructor(dataService: DataService, appSession: AppSession) {
        this._dataService = dataService;
        this._appSession = appSession;
    }

    public underwrite(): Promise<UnderwriteResponse> {
        const serviceParams = this.getUnderwriteServiceParams();
        return this._dataService.updateData(serviceParams).then(response => {
            return response.responsePayload as UnderwriteResponse;
        });
    }

    private getUnderwriteServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.UNDERWRITING,
            serviceMethod: UIServiceMethods.UNDERWRITE,
            requestPayload: this.buildUnderwriteRequest()
        });
    }

    private buildUnderwriteRequest(): UnderwriteRequest {
        const request = new UnderwriteRequest();
        request.policyDTO = this._appSession.policyDTO;
        return request;
    }
}

class UnderwriteRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.UnderwritingRequest, LifeSuite.UIServiceDTO';
    public policyDTO: PolicyDTO;
}

class UnderwriteResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.UnderwritingResponse, LifeSuite.UIServiceDTO';
    public policyDTO: PolicyDTO;
    public UnderwritingResultMsg: string;
}
