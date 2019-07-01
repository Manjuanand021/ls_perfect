import { Injector, Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { CaseLogFilterModel } from './case-log-filter.model';
import { LogEntryPagedRequest } from '../datasource/log-entry-paged-request.service';

@Injectable()
export class CaseLogFilterService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public loadCaseLogLists(caseLogFilterModel: CaseLogFilterModel): Promise<any> {
        const serviceParams: DataServiceParams = this.getStatusServiceParams(caseLogFilterModel);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload ? response.responsePayload : [];
        });
    }

    protected getStatusServiceParams(caseLogFilterModel: CaseLogFilterModel): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.ALERT_COUNTS,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.buildRequestPayload(caseLogFilterModel)
        });
    }

    private buildRequestPayload(caseLogFilterModel: CaseLogFilterModel): LogEntryPagedRequest {
        return new LogEntryPagedRequest({
            policyId: caseLogFilterModel.policyId,
            applicantId: caseLogFilterModel.applicantId
        });
    }
}
