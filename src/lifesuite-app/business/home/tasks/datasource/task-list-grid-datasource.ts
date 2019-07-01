import { Injectable, Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { IInfiniteGridDatasource } from 'life-core/component/grid';

import {
    DataServiceParams,
    TaskPagedDataRequest,
    UIServiceNames,
    UIServiceMethods,
    CompositeFilter
} from 'ls-core/service';

import { BaseGridDataSource } from 'business/shared/grid/base-grid-data-source';

import { TasksFilterModel } from '../filter';
import { TaskFilterType } from '../filter';
import { TaskType } from '../task-type';

@Injectable()
export class TaskListGridDataSource extends BaseGridDataSource implements IInfiniteGridDatasource {
    private _taskListFilterModel: TasksFilterModel;

    constructor(injector: Injector, taskFilterModel: TasksFilterModel) {
        super(injector);
        this._taskListFilterModel = taskFilterModel;
    }

    public updateFilter(tasksListFilterModel: TasksFilterModel): void {
        this._taskListFilterModel = tasksListFilterModel;
        this.resetRowCount();
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TASK_LIST_DATA,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRowsPayLoad(params)
        });
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TASK_LIST_DATA,
            serviceMethod: UIServiceMethods.GET_COUNT,
            requestPayload: this.getRowCountPayLoad(params)
        });
    }

    private getRowsPayLoad(params: IGetRowsParams): TaskPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const numOfItems = params.endRow - params.startRow;
        const request = this.buildRequestPayload(filterCriterion);
        request.startIndex = params.startRow;
        request.numItemsToFetch = numOfItems;
        request.sortFields = this.getSortFieldsForSortModel(params.sortModel);
        return request;
    }

    private getRowCountPayLoad(params: IGetRowsParams): TaskPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        return this.buildRequestPayload(filterCriterion);
    }

    private buildRequestPayload(filterCriterion: CompositeFilter): TaskPagedDataRequest {
        const filterTypeLabel = this.getTaskFilterTypeKeyByValue(this._taskListFilterModel.selectedTaskFilterType);
        const request = new TaskPagedDataRequest({
            userId: this._taskListFilterModel.selectedUser,
            teamId: this._taskListFilterModel.selectedTeam,
            taskType: TaskType[filterTypeLabel],
            filters: filterCriterion ? filterCriterion.filters : []
        });
        return request;
    }

    private getTaskFilterTypeKeyByValue(value: string): string {
        return Object.keys(TaskFilterType).find(key => TaskFilterType[key] === value);
    }
}
