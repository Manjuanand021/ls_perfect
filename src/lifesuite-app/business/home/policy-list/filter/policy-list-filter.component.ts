import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { DropdownActionType } from 'life-core/component/input';
import { AppSession } from 'ls-core/session/app-session';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { PolicyListFilterModel } from './policy-list-filter-model';
import { ApplicantStatusListModel } from '../applicant-status/applicant-status-list.model';
import { ApplicantStatusListBuilder } from '../applicant-status/applicant-status-list.builder';
import { PolicyListChannels } from '../policy-list-channels';
import { PolicyStatusCountsDTO, MetadataItem } from 'ls-core/model';
import { PolicyStatusType } from '../policy-status-type';
import { ApplicantStatusUtil } from '../applicant-status/applicant-status.util';
import { StatusCount } from '../applicant-status/status-count';
import { SplitButtonClickEvent, SplitButtonMenuClickEvent } from 'life-core/component/button';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { TabHomeDataKeys } from 'business/home/tab';
import { ConvertUtil } from 'life-core/util/lang';
import { PolicyViewType } from 'business/shared/view-type/policy-view-type';

@Component({
    selector: 'policy-list-filter',
    templateUrl: './policy-list-filter.component.html',
    styleUrls: ['./policy-list-filter.component.css']
})
@Injectable()
export class PolicyListFilterComponent extends ViewModel {
    public filters: PolicyListFilterModel;
    public applicantStatusList: Array<ApplicantStatusListModel>;
    public filterDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _appSession: AppSession;
    private _dataService: DataService;
    private _messagingService: IMessagingService;
    private _statusCountList: Array<StatusCount> = [];
    private _filtersStateValueAccessor: TabStateValueAccessor<PolicyListFilterModel>;
    private _applicantStatusUtil: ApplicantStatusUtil;

    constructor(
        injector: Injector,
        appSession: AppSession,
        applicantStatusUtil: ApplicantStatusUtil,
        dataService: DataService,
        messagingService: MessagingService,
        tabStateManager: TabStateManager
    ) {
        super(injector);
        this._appSession = appSession;
        this._dataService = dataService;
        this._messagingService = messagingService;
        this.createStateValueAccessors(tabStateManager);
        this._applicantStatusUtil = applicantStatusUtil;
    }

    public loadData(): Promise<void> {
        this.initFilters();
        this.setResolvedMetaData();
        this.setResolvedListData();
        this.setDefaultUser();
        this.setDefaultView();
        return this.loadStatuses().then(() => this.publishPolicyFilterModelChange());
    }

    private initFilters(): void {
        this.filters = this._filtersStateValueAccessor.hasValue()
            ? this._filtersStateValueAccessor.getValue()
            : (this.filters = new PolicyListFilterModel());
    }

    private setDefaultUser(): void {
        if (!this._filtersStateValueAccessor.hasValue()) {
            this.filters.selectedUser = this.getSelectedUserId();
        }
    }

    private getSelectedUserId(): number {
        const selectedUserId = ConvertUtil.toNumber(this._appSession.user.UserId);
        const selectedUser = this.listData.userList.find(user => user.ExternalCode == selectedUserId);
        return selectedUser ? selectedUser.ExternalCode : 0;
    }

    private setDefaultView(): void {
        if (!this.filters.selectedView) {
            this.setViewListOption(this.listData['MyWorkViewDefault']);
        }
    }

    private setViewListOption(defaultViewMetadata: MetadataItem[]): void {
        this.filters.selectedView = this.getPolicyViewTypeFromMetadata(defaultViewMetadata);
    }

    private getPolicyViewTypeFromMetadata(items: MetadataItem[]): PolicyViewType {
        return items[0].label == 'Applicant' ? PolicyViewType.Applicant : PolicyViewType.Case;
    }

    public onUserChange(userSelection: Event): void {
        this.publishPolicyFilterModelChange();
        this.loadStatuses();
    }

    public onTeamChange(teamSelection: Event): void {
        this.publishPolicyFilterModelChange();
        this.loadStatuses();
    }

    private publishPolicyFilterModelChange(): void {
        this._messagingService.publish(PolicyListChannels.PolicyFilterModelChange, this.filters);
    }

    public onViewChange(viewSelection: Event): void {
        this.publishCaseViewChange();
        this.loadStatuses();
    }

    private publishCaseViewChange(): void {
        this._messagingService.publish(PolicyListChannels.PolicyCaseViewChange, this.filters);
    }

    private loadStatuses(): Promise<void> {
        const serviceParams: DataServiceParams = this.getStatusServiceParams();
        return this._dataService.getData(serviceParams).then(response => {
            return this.setupStatuses(response.responsePayload as PolicyStatusCountsDTO);
        });
    }

    private setupStatuses(statusCountsDTO: PolicyStatusCountsDTO): void {
        this._statusCountList = this._applicantStatusUtil.getStatusCountList(statusCountsDTO);
        this.prepareApplicantStatusList();
        this.setDefaultSelectedStatusCount();
        this.setDefaultSelectedStatusRanges();
    }

    protected getStatusServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.POLICY_STATUS_COUNTS,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getStatusCountsServicePayload(
                this.filters.selectedUser,
                this.filters.selectedTeam,
                this.filters.selectedView
            )
        });
    }

    private getStatusCountsServicePayload(
        userId: number,
        teamId: number,
        policyViewType: PolicyViewType
    ): PolicyStatusCountsRequest {
        const request = new PolicyStatusCountsRequest();
        if (userId) request.userId = userId;
        if (teamId) request.teamId = teamId;
        request.type = policyViewType as number;
        request.selectedDate = new Date(Date.now());
        request.selectedDateField = 'ApplicantStatusDate';
        request.agingRangeResolveType = 'MyWorkAgingRange';
        return request;
    }

    private prepareApplicantStatusList(): void {
        const onStatusAgingRangeChange = (event: SplitButtonMenuClickEvent) => {
            this.setSelectedStatus(event);
            this.publishPolicyFilterModelChange();
        };
        this.applicantStatusList = [];
        this._statusCountList.forEach(status => {
            const applicantStatusModel = new ApplicantStatusListModel();
            applicantStatusModel.header = this.getStatusDescription(status.statusType);
            applicantStatusModel.statusList = ApplicantStatusListBuilder.buildApplicantStatusList(
                status.agingRanges,
                onStatusAgingRangeChange
            );
            applicantStatusModel.statusType = status.statusType;
            applicantStatusModel.onStatusSelected = this.onStatusSelected;
            this.applicantStatusList.push(applicantStatusModel);
        });
    }

    public onStatusSelected(event: SplitButtonClickEvent): void {
        this.setSelectedStatus(event);
        this.publishPolicyFilterModelChange();
    }

    public setSelectedStatus(event: SplitButtonClickEvent | SplitButtonMenuClickEvent): void {
        const statusType = parseInt(event.id);
        const statusSelectedRange = parseInt(event.item.id);
        this.filters.selectedStatusCount = this.getStatusCountByType(statusType);
        this.filters.selectedStatusCount.selectedRange = statusSelectedRange;
        this.filters.selectedRanges[this.getStatusCountIndexByType(statusType)] = statusSelectedRange;
    }

    private setDefaultSelectedStatusCount(): void {
        if (!this.filters.selectedStatusCount) {
            const defaultStatusCount = this.getStatusCountByType(PolicyStatusType.Total);
            this.filters.selectedStatusCount = defaultStatusCount;
        }
    }

    private setDefaultSelectedStatusRanges(): void {
        if (!this.filters.selectedRanges) {
            this.filters.selectedRanges = this.applicantStatusList.map(status => parseInt(status.statusList[0].id));
        }
    }

    private getStatusCountByType(type: number): StatusCount {
        return this._statusCountList.find(status => status.statusType == type);
    }

    private getStatusCountIndexByType(type: number): number {
        return this._statusCountList.findIndex(status => status.statusType == type);
    }

    private getStatusDescription(statusType: number): string {
        return this._applicantStatusUtil.getApplicantStatusLabel(statusType);
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._filtersStateValueAccessor = new TabStateValueAccessor<PolicyListFilterModel>(
            tabStateManager,
            TabHomeDataKeys.POLICY_LIST_FILTERS
        );
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(PolicyListChannels.PolicyFilterModelChange);
        this._messagingService.closeChannel(PolicyListChannels.PolicyCaseViewChange);
        this._filtersStateValueAccessor.setValue(this.filters);
        super.ngOnDestroy();
    }
}

export class PolicyStatusCountsRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.PolicyStatusCountsRequest, LifeSuite.UIServiceDTO';
    public teamId: number;
    public userId: number;
    public type: number;
    public selectedDate: Date;
    public selectedDateField: string;
    public agingRangeResolveType: string;
}
