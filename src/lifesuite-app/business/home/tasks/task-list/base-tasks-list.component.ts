import { Injector, Input } from '@angular/core';

import { DataGridColumns, BaseInfiniteGridViewModel } from 'life-core/component/grid';

import { GridDataStateKeys } from 'business/shared/grid';
import { TaskListColumnsBuilder } from './task-list-columns.builder';
import { TasksFilterModel, TaskFilterType } from '../filter';
import { TaskListGridDataSource } from '../datasource';
import { TaskUtil } from '../task-util';
import { IOpenTask } from './delegates';

export abstract class BaseTaskListComponent<T> extends BaseInfiniteGridViewModel<T> {
    public isOpenButtonDisabled: boolean;

    private _openTaskDelegate: IOpenTask;
    private _taskUtil: TaskUtil;
    private _previousSelectedTask: string;

    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        // TODO - Make this mandatory once image-received delegate is created
        openTaskDelegate?: IOpenTask
    ) {
        super(injector, taskListGridDataSource, taskListColumnsBuilder);
        this._taskUtil = injector.get(TaskUtil);
        this._openTaskDelegate = openTaskDelegate;
        this.filterModel = new TasksFilterModel();
        this.toggleOpenButton(true);
    }

    @Input()
    public set filter(value: TasksFilterModel) {
        this.setSelectedTaskFilterModel(value);
        this.setTaskGridTitle();
        setTimeout(() => {
            this.onFilterModelReceived(value, true);
        });
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build(this.filterModel.selectedTaskFilterType);
    }

    public onRowClicked($event: any): void {
        this.toggleOpenButton(false);
        super.onRowClicked($event);
    }

    public onRowDoubleClicked($event: any): void {
        this.toggleOpenButton(false);
        super.onRowDoubleClicked($event);
    }

    public onOpenButtonClick(): void {
        this.openSelectedGridRow();
    }

    protected openSelectedGridRow(): void {
        if (this.anyGridRowsSelected() && this.openTaskImplemented(this.filterModel.selectedTaskFilterType)) {
            this.updateGridRowsState();
            this._openTaskDelegate.openTask(this.selectedGridRows[0]);
        }
    }

    protected setTaskGridTitle(): void {
        this.title = this.getGridTitle();
    }

    protected rebuildGridColumnsWihSortOrder(): void {
		super.rebuildGridColumnsWihSortOrder();
        this.preservePreviousFilterValue(this.filterModel);
    }

	protected retainSortOrder(): boolean {
        return !this.isTaskSelectionChanged(this.filterModel);
    }
	
    protected registerFilterChangeHandlers(): void {
        // filter change is handled differently in task-list
        // no logic needed here
    }

    protected getGridStateKey(): string {
        return GridDataStateKeys.TASK_LIST;
    }

    // protected abstract getOpenTaskDelegate(): OpenTaskDelegateBase;

    protected getGridTitle(): string {
        return this._taskUtil.getTaskTypeGridTitle(this.filterModel.selectedTaskFilerType);
    }

    private toggleOpenButton(value: boolean): void {
        this.isOpenButtonDisabled = value;
    }

    private setSelectedTaskFilterModel(value: TasksFilterModel): void {
        this.filterModel = value;
    }

    private preservePreviousFilterValue(value: TasksFilterModel): void {
        this._previousSelectedTask = value.selectedTaskFilterType;
    }

    private isTaskSelectionChanged(value: TasksFilterModel): boolean {
        return this._previousSelectedTask && this._previousSelectedTask != value.selectedTaskFilterType;
    }

    // Checking selectedTaskFilterType is equal to imageReceived or not to avoid error on open button click in case of imageReceived filter.
    // This only opens an image in new tab and is not yet implemented in MT. Need to change this code accordingly in future
    private openTaskImplemented(taskFilterType: string): boolean {
        return taskFilterType != TaskFilterType.ImgRecd;
    }
}
