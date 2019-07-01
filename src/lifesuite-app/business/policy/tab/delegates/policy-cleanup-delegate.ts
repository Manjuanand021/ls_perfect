import { UIResponse } from './../../../../ls-core/service/data-service.model';
import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { AppSession } from 'ls-core/session';

@Injectable()
export class PolicyCleanupDelegate {
    private _dataService: DataService;
    private _appSession: AppSession;

    constructor(dataService: DataService, appSession: AppSession) {
        this._dataService = dataService;
        this._appSession = appSession;
    }

    public cleanup(): Promise<void[]> {
        const results: Promise<void>[] = [this.autoUnderwrite(), this.unloadPolicyFromSession()];
        this.resetPolicy();
        return Promise.all(results);
    }

    private autoUnderwrite(): Promise<void> {
        const serviceParams = this.getAutoUnderwriteServiceParams();
        return this._dataService.updateData(serviceParams).then(() => Promise.resolve());
    }

    private getAutoUnderwriteServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.AUTO_UNDERWRITE_SERVICE,
            serviceMethod: UIServiceMethods.AUTO_UNDERWRITE,
            requestPayload: this.buildAutoUnderwriteRequest()
        });
    }

    private buildAutoUnderwriteRequest(): AutoUnderwriteRequest {
        return new AutoUnderwriteRequest();
    }

    private unloadPolicyFromSession(): Promise<void> {
        const serviceParams = this.getUnloadPolicyServiceParams();
        return this._dataService.updateData(serviceParams).then(() => Promise.resolve());
    }

    private getUnloadPolicyServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.UNLOAD_SESSION_POLICY_SERVICE,
            serviceMethod: UIServiceMethods.UNLOAD_SESSION_POLICY,
            requestPayload: this.buildUnloadPolicyRequest()
        });
    }

    private buildUnloadPolicyRequest(): RefreshDTORequest {
        const request = new RefreshDTORequest();
        request.rootDTOObject = this._appSession.policyDTO;
        return request;
    }

    private resetPolicy(): void {
        this._appSession.resetPolicy();
    }
}

class RefreshDTORequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.RefreshDTORequest, LifeSuite.UIServiceDTO';
    public rootDTOObject: Object;
}

class AutoUnderwriteRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.AutoUnderwriteRequest, LifeSuite.UIServiceDTO';
    public autoUWRequestPayLoad: string;
}
