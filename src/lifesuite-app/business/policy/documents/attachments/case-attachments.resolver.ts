import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session/app-session';

import { CaseAttachmentRequest } from './case-attachments-request';

@Injectable()
export class CaseAttachmentsResolver extends BaseViewDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.CASE_ATTACHEMENT_SERVICE,
            serviceMethod: UIServiceMethods.DO_PROCESS,
            requestPayload: this.getRequestPayload()
        });
    }

    private getRequestPayload(): CaseAttachementGetFileListRequest {
        const request = new CaseAttachementGetFileListRequest();
        request.policyID = this._appSession.policyId;
        return request;
    }
}

class CaseAttachementGetFileListRequest extends CaseAttachmentRequest {
    public readonly $type: string =
        'life.ls.ui.ria.dto.requests.CaseAttachementGetFileListRequest, LifeSuite.UIServiceDTO';
}
