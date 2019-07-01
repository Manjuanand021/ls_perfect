import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

@Injectable()
export class ExportCasesService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public exportCases(policyNumberList: string): void {
        const serviceParams = this.getExportCasesServiceParams(policyNumberList);
        this._dataService.updateData(serviceParams);
    }

    private getExportCasesServiceParams(policyNumberList: string): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.EXPORT_CASE_SERVICE,
            serviceMethod: UIServiceMethods.EXPORT_CASE,
            requestPayload: this.buildExportCaseRequest(policyNumberList)
        });
    }

    private buildExportCaseRequest(policyNumberList: string): ExportCaseRequest {
        const request = new ExportCaseRequest();
        request.PolicyNumberList = policyNumberList;
        return request;
    }
}

class ExportCaseRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ExportCaseRequest, LifeSuite.UIServiceDTO';
    public PolicyNumberList: string;
}
