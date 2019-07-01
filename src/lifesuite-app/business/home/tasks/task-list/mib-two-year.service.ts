import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

@Injectable()
export class MIBTwoYearCountService {
    private _dataService: DataService;
    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public update(policyPersonId: number): Promise<number> {
        const serviceParams: DataServiceParams = this.getServiceParams(policyPersonId);
        return this._dataService.deleteData(serviceParams).then(response => {
            return response && response.responsePayload ? (response.responsePayload as number) : 0;
        });
    }

    private getServiceParams(policyPersonId: number): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TASK_LIST_MIB_TWO_YEAR_COUNT,
            serviceMethod: UIServiceMethods.UPDATE_MIBTWOYR_COUNT,
            requestPayload: this.buildRequestPayload(policyPersonId)
        });
    }

    private buildRequestPayload(policyPersonId: number): TaskListMibTwoYrCountRequest {
        const request = new TaskListMibTwoYrCountRequest();
        request.policyPersonId = policyPersonId;
        return request;
    }
}

class TaskListMibTwoYrCountRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.TaskListMibTwoYrCountRequest, LifeSuite.UIServiceDTO';
    public policyPersonId: Number;
}
