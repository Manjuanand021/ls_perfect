import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { TabChannels, TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from 'ui/tabview';

import { TasksFilterModel } from 'business/home/tasks/filter';
import { TabHomeDataKeys } from 'business/home/tab';
import { SummaryFilterModel } from 'business/home/summary/filter';
import { TaskFilterService, TaskCounts } from 'business/home/tasks/filter/task-filter.service';
import { SummaryChannels } from 'business/home/summary/summary-channels';

@Component({
    selector: 'policy-alerts',
    templateUrl: './policy-alerts.component.html'
})
export class PolicyAlertsComponent extends ViewModel {
    public inboundPolicyCount: number;
    public underwritingPolicyCount: number;
    public outboxPolicyCount: number;
    public postIssuePolicyCount: number;
    public reviewPolicyCount: number;
    public preIssuePolicyCount: number;

    private _messagingService: IMessagingService;
    private _taskFilterService: TaskFilterService;
    private _filtersStateValueAccessor: TabStateValueAccessor<TasksFilterModel>;
    private _taskFilters: TasksFilterModel;
    private _summaryFilterModel: SummaryFilterModel;
    private _tabDescriptorFactory: LsTabDescriptorFactory;

    constructor(
        injector: Injector,
        messagingService: MessagingService,
        taskFilterService: TaskFilterService,
        tabStateManager: TabStateManager,
        tabDescriptorFactory: TabDescriptorFactory
    ) {
        super(injector);
        this._messagingService = messagingService;
        this._taskFilterService = taskFilterService;
        this.createStateValueAccessors(tabStateManager);
        this._tabDescriptorFactory = tabDescriptorFactory as LsTabDescriptorFactory;
        this._taskFilters = new TasksFilterModel();
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._filtersStateValueAccessor = new TabStateValueAccessor<TasksFilterModel>(
            tabStateManager,
            TabHomeDataKeys.TASK_LIST_FILTERS
        );
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.registerHandlers();
    }

    public registerHandlers(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribe(SummaryChannels.UserTeamChange, summaryFilterModel =>
                this.onSummaryFilterModelReceived(summaryFilterModel)
            )
        );
    }

    public onSummaryFilterModelReceived(summaryFilterModel: SummaryFilterModel): void {
        this._summaryFilterModel = summaryFilterModel;
        this.getPolicyAlerts().then(alerts => {
            this.updateAlerts(alerts);
        });
    }

    private getPolicyAlerts(): Promise<TaskCounts> {
        return this._taskFilterService.loadTaskCounts(this._summaryFilterModel);
    }

    private updateAlerts(alerts: TaskCounts): void {
        this.inboundPolicyCount = alerts.msgInbox;
        this.underwritingPolicyCount = alerts.reqUnderwriting;
        this.outboxPolicyCount = alerts.msgOutbox;
        this.postIssuePolicyCount = alerts.reqPostIssue;
        this.reviewPolicyCount = alerts.msgReview;
        this.preIssuePolicyCount = alerts.reqPreIssue;
    }

    public onAlertClick(taskType: string): void {
        this.setTaskTabFilters(taskType);
        this.navigateToTaskTab();
    }

    private setTaskTabFilters(taskType: string): void {
        this._taskFilters.selectedTaskFilterType = taskType;
        this._taskFilters.selectedUser = this._summaryFilterModel.selectedUser;
        this._taskFilters.selectedTeam = this._summaryFilterModel.selectedTeam;
        this._filtersStateValueAccessor.setValue(this._taskFilters);
    }

    private navigateToTaskTab(): void {
        const tabTasks = this._tabDescriptorFactory.createSecondaryTabDescriptorTasks();
        tabTasks.selected = true;
        this._messagingService.publish(TabChannels.SelectSecondaryTab, tabTasks);
    }
}
