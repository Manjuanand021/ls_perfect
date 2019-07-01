import { Component, Injector, Injectable } from '@angular/core';

import { DataGridColumns, BaseInfiniteGridViewModel } from 'life-core/component/grid';

import { PolicyProxy, AgingRangeDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { GridDataStateKeys } from 'business/shared/grid';
import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { PolicyListGridColumnsBuilder } from './policy-list-grid-columns.builder';
import { PolicyListGridDataSource } from '../datasource/policy-list-grid-datasource';
import { PolicyListFilterModel } from '../filter/policy-list-filter-model';
import { PolicyListChannels } from '../policy-list-channels';
import { I18n } from 'life-core/i18n';
import { StatusCount } from 'business/home/policy-list/applicant-status/status-count';
import { PolicyAgingRangeUtil } from 'business/home/policy-list/applicant-status/policy-aging-range.util';
import { ApplicantStatusUtil } from 'business/home/policy-list/applicant-status/applicant-status.util';
import { PolicyStatusType, PolicyAgingRangeType } from 'business/home/policy-list/policy-status-type';

@Component({
    selector: 'policy-list',
    templateUrl: './policy-list.component.html',
    styleUrls: ['./policy-list.component.scss'],
    providers: [PolicySubscriber, PolicyListGridDataSource, PolicyListGridColumnsBuilder]
})
@Injectable()
export class PolicyListComponent extends BaseInfiniteGridViewModel<PolicyProxy> {
    public statusValue: string;
    public rangeValue: string;
    public isOpenPolicyButtonDisabled: boolean;
    private _openPolicyDelegate: OpenPolicyDelegate;
    private _applicantStatusUtil: ApplicantStatusUtil;
    private _defaultFilterLabelValue: string;
    constructor(
        injector: Injector,
        gridDataSource: PolicyListGridDataSource,
        gridColumnsBuilder: PolicyListGridColumnsBuilder,
        openPolicyDelegate: OpenPolicyDelegate,
        i18n: I18n
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this._openPolicyDelegate = openPolicyDelegate;
        this.filterModel = new PolicyListFilterModel();
        this.i18n = i18n;
        this._applicantStatusUtil = new ApplicantStatusUtil(i18n);
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build(this.filterModel.selectedView);
    }

    public onOpenPolicyButtonClick(): void {
        this.openSelectedGridRow();
    }

    protected openSelectedGridRow(): void {
        if (this.anyGridRowsSelected()) {
            this.updateGridRowsState();
            this._openPolicyDelegate.openPolicy(this.selectedGridRows[0]);
        } else {
            this.showNoRowSelectedDialog(
                this.i18n({ value: 'Please select a policy.', id: 'home.policylist.list.alertmsg.selectpolicy' }),
                this.i18n({ value: 'Open Policy', id: 'home.policylist.list.alertmsg.openpolicy' })
            );
        }
    }

    protected setupData(): void {
        this.setDefaultFilterLabelValue();
    }

    protected registerFilterChangeHandlers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(PolicyListChannels.PolicyFilterModelChange, policyListFilterModel => {
                this.onFilterModelReceived(policyListFilterModel);
                this.setApplicantStatusFilterInfo();
            })
        );
        this.subscriptionTracker.track(
            this.messagingService.subscribe(PolicyListChannels.PolicyCaseViewChange, policyListFilterModel => {
                this.onFilterModelReceived(policyListFilterModel, true);
                this.setApplicantStatusFilterInfo();
            })
        );
    }

    protected getGridStateKey(): string {
        return GridDataStateKeys.POLICY_LIST;
    }

    protected rowDataMatch(rowData1: PolicyProxy, rowData2: PolicyProxy): boolean {
        // In case view, PolicyPersonId does not exist, use only PolicyId for compare
        return rowData1.PolicyPersonId
            ? rowData1.PolicyId === rowData2.PolicyId && rowData1.PolicyPersonId === rowData2.PolicyPersonId
            : rowData1.PolicyId === rowData2.PolicyId;
    }

    protected onSelectedGridRowsChange(): void {
        this.isOpenPolicyButtonDisabled = !this.anyGridRowsSelected();
    }

    private setApplicantStatusFilterInfo(): void {
        const statusCount: StatusCount = this.filterModel.selectedStatusCount;
        if (statusCount) {
            const agingRange: AgingRangeDTO = PolicyAgingRangeUtil.getAgingRangeByType(
                statusCount.agingRanges,
                statusCount.selectedRange
            );

            this.statusValue =
                statusCount.statusType !== PolicyStatusType.Total
                    ? this._applicantStatusUtil.getApplicantStatusLabel(statusCount.statusType)
                    : this._defaultFilterLabelValue;

            this.rangeValue =
                agingRange.rangeType !== PolicyAgingRangeType.Total
                    ? PolicyAgingRangeUtil.getAgingRangeLabel(agingRange)
                    : this._defaultFilterLabelValue;
        }
    }

    private setDefaultFilterLabelValue(): void {
        this._defaultFilterLabelValue = this.i18n({ value: 'All', id: 'policylist.filter.all' });
    }
}
