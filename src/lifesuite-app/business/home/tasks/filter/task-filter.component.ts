import { Component, Injector, EventEmitter, Output } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ConvertUtil } from 'life-core/util/lang';
import { ArrayUtil } from 'life-core/util/lang';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { InfoButtonClickEvent } from 'life-core/component/button';
import { DropdownActionType } from 'life-core/component/input';

import { AppSession } from 'ls-core/session/app-session';

import { TabHomeDataKeys } from 'business/home/tab';
import { TasksFilterModel } from './tasks-filter.model';
import { TaskCountsListModel } from '../task-counts/task-counts-list.model';
import { TaskFilterService, TaskCounts } from './task-filter.service';
import { TaskFilterType } from './task-filter-type';
import { TaskUtil } from '../task-util';
import { MessagingService } from 'life-core/messaging';
import { TaskListChannels } from 'business/home/tasks/task-list-channels';

@Component({
    selector: 'tasks-filter',
    templateUrl: './task-filter.component.html',
    styleUrls: ['./task-filter.component.css']
})
export class TasksFilterComponent extends ViewModel {
    @Output()
    public filterChange: EventEmitter<TasksFilterModel> = new EventEmitter<TasksFilterModel>();
    public filters: TasksFilterModel;
    public taskFilterTypes: Array<TaskCountsListModel>;
    public filterDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _appSession: AppSession;
    private _filtersStateValueAccessor: TabStateValueAccessor<TasksFilterModel>;
    private _taskFilterService: TaskFilterService;
    private _messagingService: MessagingService;
    private _taskUtil: TaskUtil;

    constructor(
        injector: Injector,
        appSession: AppSession,
        taskFilterService: TaskFilterService,
        tabStateManager: TabStateManager,
        messagingService: MessagingService,
        taskUtil: TaskUtil
    ) {
        super(injector);
        this._appSession = appSession;
        this._taskFilterService = taskFilterService;
        this._messagingService = messagingService;
        this.registerHandlers();
        this.createStateValueAccessors(tabStateManager);
        this._taskUtil = taskUtil;
    }

    public loadData(): Promise<void> {
        this.initFilters();
        this.setResolvedListData();
        this.setDefaultUser();
        this.loadTaskCounts();
        return Promise.resolve();
    }

    public onUserChange(_userSelection: Event): void {
        this.updateGridViewData();
    }

    public onTeamChange(_teamSelection: Event): void {
        this.updateGridViewData();
    }

    public ngOnDestroy(): void {
        this._filtersStateValueAccessor.setValue(this.filters);
        this._messagingService.closeChannel(TaskListChannels.TaskCountsChanged);
        super.ngOnDestroy();
    }

    private initFilters(): void {
        this.filters = this._filtersStateValueAccessor.hasValue()
            ? this._filtersStateValueAccessor.getValue()
            : (this.filters = new TasksFilterModel());
    }

    private setDefaultUser(): void {
        if (!this._filtersStateValueAccessor.hasValue()) {
            const loggedInUser = this.listData.userList.find(user => user.ExternalCode == this._appSession.user.UserId);
            // referred flex code
            this.filters.selectedUser = loggedInUser
                ? ConvertUtil.toNumber(this._appSession.user.UserId)
                : this.listData.userList[0].ExternalCode;
        }
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._filtersStateValueAccessor = new TabStateValueAccessor<TasksFilterModel>(
            tabStateManager,
            TabHomeDataKeys.TASK_LIST_FILTERS
        );
    }

    private loadTaskCounts(): void {
        this._taskFilterService.loadTaskCounts(this.filters).then((result: TaskCounts) => {
            this.setupTaskCounts(result);
            this.publishFilterModelChange();
            // this.publishTasksCountChange();
        });
    }

    private setupTaskCounts(taskCounts: TaskCounts): void {
        this.prepareTaskFilterTypes(taskCounts);
        this.setDefaultSelectedTaskFilterType();
    }

    private prepareTaskFilterTypes(taskCounts: TaskCounts): void {
        // List we receive from back end is not in expected sort order
        // hence sorting the filter types list  - referred flex
        const sortAs = [
            'msgInbox',
            'msgOutbox',
            'pendingMail',
            'reqToOrder',
            'reqUnderwriting',
            'msgReview',
            'diaryActivity',
            'reqPreIssue',
            'reqPostIssue',
            'imageReceived',
            'mibTwoYr'
        ];

        const taskFilterButtonWidth: { readonly [taskFilterType: string]: number } = {
            [TaskFilterType.Inbox]: 70,
            [TaskFilterType.Outbox]: 70,
            [TaskFilterType.PendingMail]: 80,
            [TaskFilterType.ReqToOrder]: 80,
            [TaskFilterType.PastDueUWReq]: 90,
            [TaskFilterType.CaseMgrRevMsg]: 100,
            [TaskFilterType.Diary]: 70,
            [TaskFilterType.PastDuePreIssue]: 90,
            [TaskFilterType.PastDuePostIssue]: 100,
            [TaskFilterType.ImgRecd]: 70,
            [TaskFilterType.MIB2Yr]: 80
        };

        this.taskFilterTypes = [];

        Object.keys(taskCounts).forEach((taskType: string) => {
            if (taskType !== '$type') {
                const taskCountsListModel = new TaskCountsListModel();
                taskCountsListModel.header = this.getTaskFilterTypeDescription(taskType);
                taskCountsListModel.type = taskType;
                taskCountsListModel.count = taskCounts[taskType];
                taskCountsListModel.buttonWidth = taskFilterButtonWidth[taskCountsListModel.type];
                taskCountsListModel.onFilterTypeSelected = this.onFilterTypeClicked;
                this.taskFilterTypes.push(taskCountsListModel);
            }
        });

        const sortCompareFunction = ArrayUtil.getSortCompareFunction(sortAs, 'type');
        this.taskFilterTypes = this.taskFilterTypes.sort(sortCompareFunction);
    }

    private getTaskFilterTypeDescription(filterType: string): string {
        return this._taskUtil.getTaskTypeCountLabel(filterType);
    }

    private onFilterTypeClicked(event: InfoButtonClickEvent): void {
        this.setSelectedStatus(event);
        this.publishFilterModelChange();
    }

    private setSelectedStatus(event: InfoButtonClickEvent): void {
        this.filters.selectedTaskFilterType = event.id;
        this.filters.taskCount = parseInt(event.label);
    }

    private setDefaultSelectedTaskFilterType(): void {
        if (!this.filters.selectedTaskFilterType) {
            this.filters.selectedTaskFilterType = TaskFilterType.Inbox;
        }
    }

    private updateGridViewData(): void {
        this.loadTaskCounts();
    }

    private publishFilterModelChange(): void {
        this.filterChange.emit(this.filters);
    }

    private registerHandlers(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribe(TaskListChannels.TaskCountsChanged, () => {
                this.loadTaskCounts();
            })
        );
    }
}
