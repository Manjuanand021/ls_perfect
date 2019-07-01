import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { LSFileProxyDTO } from 'ls-core/model';

import { CaseAttachmentRequest } from '../../../attachments/case-attachments-request';

@Injectable()
export class CaseDocumentsForAttachmentService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    /* Delete Documents */
    public deleteDocuments(policyId: number, file: LSFileProxyDTO): Promise<CaseAttachmentsResponse> {
        const serviceParams = this.getDeleteDocumentsServiceParams(policyId, file);
        return this._dataService.updateData(serviceParams).then(response => {
            return response.responsePayload as CaseAttachmentsResponse;
        });
    }

    /* Attach Documents */
    public attachDocuments(policyId: number, file: LSFileProxyDTO): Promise<CaseAttachmentsResponse> {
        const serviceParams = this.getAttachDocumentsServiceParams(policyId, file);
        return this._dataService.updateData(serviceParams).then(response => {
            return response.responsePayload as CaseAttachmentsResponse;
        });
    }

    private getDeleteDocumentsServiceParams(policyId: number, file: LSFileProxyDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.CASE_ATTACHEMENT_SERVICE,
            serviceMethod: UIServiceMethods.DO_PROCESS,
            requestPayload: this.buildDeleteDocumentsRequest(policyId, file)
        });
    }

    private buildDeleteDocumentsRequest(policyId: number, file: LSFileProxyDTO): CaseAttachmentDeleteFileRequest {
        const request = new CaseAttachmentDeleteFileRequest();
        request.policyID = policyId;
        request.file = file;
        return request;
    }

    private getAttachDocumentsServiceParams(policyId: number, file: LSFileProxyDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.CASE_ATTACHEMENT_SERVICE,
            serviceMethod: UIServiceMethods.DO_PROCESS,
            requestPayload: this.buildAttachDocumentsRequest(policyId, file)
        });
    }

    private buildAttachDocumentsRequest(policyId: number, file: LSFileProxyDTO): CaseAttachmentAttachFileRequest {
        const request = new CaseAttachmentAttachFileRequest();
        request.policyID = policyId;
        request.file = file;
        return request;
    }
}

class CaseAttachmentAttachFileRequest extends CaseAttachmentRequest {
    public readonly $type: string =
        'life.ls.ui.ria.dto.requests.CaseAttachementAttachFileRequest, LifeSuite.UIServiceDTO';
    public file: LSFileProxyDTO;
}

class CaseAttachmentDeleteFileRequest extends CaseAttachmentAttachFileRequest {
    public readonly $type: string =
        'life.ls.ui.ria.dto.requests.CaseAttachementDeleteFileRequest, LifeSuite.UIServiceDTO';
}

export class CaseAttachmentsResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.CaseAttachementResponse, LifeSuite.UIServiceDTO';
    public success: boolean;
    public attachementList: LSFileProxyDTO[];
    public workInProgressList: LSFileProxyDTO[];
}
