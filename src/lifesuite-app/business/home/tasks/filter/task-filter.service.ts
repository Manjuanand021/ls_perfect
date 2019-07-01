import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { TasksFilterModel } from './tasks-filter.model';

@Injectable()
export class TaskFilterService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    protected getStatusServiceParams(taskFilterModel: TasksFilterModel): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.ALERT_COUNTS,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.buildRequestPayload(taskFilterModel)
        });
    }

    private buildRequestPayload(taskFilterModel: TasksFilterModel): TaskCountsRequest {
        return new TaskCountsRequest({
            userId: taskFilterModel.selectedUser,
            teamId: taskFilterModel.selectedTeam
        });
    }

    public loadTaskCounts(taskFilterModel: TasksFilterModel): Promise<any> {
        const serviceParams: DataServiceParams = this.getStatusServiceParams(taskFilterModel);
        return this._dataService
            .getData(serviceParams)
            .then(response => {
                return response.responsePayload ? (response.responsePayload as TaskCounts) : [];
            })
            .catch(response => {
                return [];
            });
    }
}

class TaskCountsRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.TaskCountsRequest, LifeSuite.UIServiceDTO';
    public teamId: number;
    public userId: number;
    public selectedDate: Date;
    constructor({ teamId, userId, selectedDate }: { teamId: number; userId: number; selectedDate?: Date }) {
        this.teamId = teamId || 0;
        this.userId = userId || 0;
        this.selectedDate = selectedDate || new Date();
    }
}

export class TaskCounts {
    public msgInbox: number;
    public msgOutbox: number;
    public pendingMail: number;
    public msgReview: number;
    public reqUnderwriting: number;
    public reqPostIssue: number;
    public reqPreIssue: number;
    public reqToOrder: number;
    public diaryActivity: number;
    public imageReceived: number;
    public mibTwoYr: number;
}
