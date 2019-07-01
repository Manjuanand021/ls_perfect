import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { LSFileProxyDTO } from 'ls-core/model';

import { CaseAttachmentRequest } from './../attachments/case-attachments-request';

@Injectable()
export class CaseTemplatesService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    private getCaseTemplatesServiceParams(policyId: number, insuredId: number): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.CASE_TEMPLATES_SERVICE,
            serviceMethod: UIServiceMethods.DO_PROCESS,
            requestPayload: this.buildCaseTemplatesRequest(policyId, insuredId)
        });
    }

    private buildCaseTemplatesRequest(policyId: number, insuredId: number): CaseTemplateRequest {
        const request = new CaseTemplateRequest();
        request.errMsg = '';
        request.insuredId = insuredId;
        request.policyID = policyId;
        return request;
    }

    public getCaseTemplates(policyId: number, insuredId: number): Promise<CaseTemplateResponse> {
        const serviceParams = this.getCaseTemplatesServiceParams(policyId, insuredId);
        return this._dataService.updateData(serviceParams).then(response => {
            return response.responsePayload as CaseTemplateResponse;
        });
    }
}

class CaseTemplateRequest extends CaseAttachmentRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.CaseTemplatesGetFilesRequest, LifeSuite.UIServiceDTO';
    public insuredId: number;
}

class CaseTemplateResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.CaseTemplatesResponse, LifeSuite.UIServiceDTO';
    public success: boolean;
    public fileList: LSFileProxyDTO[];
}
