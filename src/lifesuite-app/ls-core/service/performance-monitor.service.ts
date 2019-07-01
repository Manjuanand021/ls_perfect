import { Injectable } from '@angular/core';

import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

@Injectable()
export class PerformanceMonitorService {
    private _dataService: DataService;
    private _startDateTime: Date;
    private _completeDateTime: Date;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(isInitialData: boolean, policyNumber: string, action: string): Promise<any> {
        const request = this.getRequestPayload(isInitialData, policyNumber, action);
        const serviceParams = this.getServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload;
        });
    }

    private getServiceParams(request: PerformanceMonitorRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.PERFORMANCE_MONITOR,
            serviceMethod: UIServiceMethods.PERFORMANCE_MONITOR,
            requestPayload: request
        });
    }

    private getRequestPayload(isInitialData: boolean, policyNumber: string, action: string): PerformanceMonitorRequest {
        // MT code checks if startDateTime is null else goes for completeDateTime check. If we do not set value of start and
        // completeDateTime to undefined conditionally, everytime it logs startDate time in case of caseRefresh.
        // Hence following method (setStartAndCompleteDateTime) is required.

        this.setStartAndCompleteDateTime(isInitialData);

        const request = new PerformanceMonitorRequest();
        request.policyNumber = policyNumber;
        request.action = action;
        request.actionStartDateTime = this._startDateTime;
        request.actionCompletedDateTime = this._completeDateTime;
        return request;
    }

    private setStartAndCompleteDateTime(isInitialData: boolean): void {
        this._startDateTime = isInitialData ? new Date() : undefined;
        this._completeDateTime = isInitialData ? undefined : new Date();
    }
}

export class PerformanceMonitorRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.PerformanceMonitorRequest, LifeSuite.UIServiceDTO';

    public policyNumber: string;
    public action: string;
    public actionStartDateTime: Date;
    public actionCompletedDateTime: Date;
}
