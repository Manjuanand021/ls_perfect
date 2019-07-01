import { Injectable } from '@angular/core';
import { DateUtil } from 'life-core/util';
import {
    CompositeFilter,
    Filter,
    NumericFilter,
    BooleanFilter,
    CompositeANDFilter,
    SimpleTextFilter,
    DateFilter,
    CompositeORFilter
} from 'ls-core/service';
import { PolicyListFilterModel } from './policy-list-filter-model';
import { PolicyStatusType } from '../policy-status-type';
import { ApplicantStatusUtil } from '../applicant-status/applicant-status.util';
import { AgingRangeDTO } from 'ls-core/model';
import { PolicyViewType } from 'business/shared/view-type/policy-view-type';

@Injectable()
export class PolicyListFilterBuilder {
    private _policyListFilterModel: PolicyListFilterModel;
    private _applicantStatusUtil: ApplicantStatusUtil;

    constructor(applicantStatusUtil: ApplicantStatusUtil) {
        this._applicantStatusUtil = applicantStatusUtil;
    }

    public buildPolicyListFilter(policyListFilterModel: PolicyListFilterModel): CompositeFilter {
        this._policyListFilterModel = policyListFilterModel;
        if (
            this._policyListFilterModel &&
            (this._policyListFilterModel.selectedUser ||
                this._policyListFilterModel.selectedTeam ||
                this._policyListFilterModel.selectedView ||
                this._policyListFilterModel.selectedStatusCount)
        ) {
            const policyListFilter = new CompositeFilter([]);
            if (this.isCaseViewSelected()) policyListFilter.filters.push(this.getCaseViewFilter());
            if (this.isUserSelected()) policyListFilter.filters.push(this.getUserFilter());
            if (this.isTeamSelected()) policyListFilter.filters.push(this.getTeamFilter());
            if (this.isApplicantStatusSelected()) policyListFilter.filters.push(this.getApplicantStatusFilter());
            return policyListFilter;
        }
    }

    private isUserSelected(): boolean {
        return this._policyListFilterModel.selectedUser != undefined && this._policyListFilterModel.selectedUser != 0;
    }

    private isTeamSelected(): boolean {
        return this._policyListFilterModel.selectedTeam != undefined && this._policyListFilterModel.selectedTeam != 0;
    }

    private getUserFilter(): CompositeORFilter {
        const filters: Array<Filter> = [];
        const uwNumericFilter = new NumericFilter(
            'UnderwriterId',
            this._policyListFilterModel.selectedUser,
            this._policyListFilterModel.selectedUser
        );
        filters.push(uwNumericFilter);

        const saNumericFilter = new NumericFilter(
            'ServiceAssociateId',
            this._policyListFilterModel.selectedUser,
            this._policyListFilterModel.selectedUser
        );
        filters.push(saNumericFilter);

        return this.prepareCompositeOrFilter(filters);
    }

    private getTeamFilter(): NumericFilter {
        return new NumericFilter(
            'TeamId',
            this._policyListFilterModel.selectedTeam,
            this._policyListFilterModel.selectedTeam
        );
    }

    private isCaseViewSelected(): boolean {
        return this._policyListFilterModel.selectedView == PolicyViewType.Case;
    }

    private getCaseViewFilter(): BooleanFilter {
        return new BooleanFilter('PrimaryInsuredFlag', true);
    }

    private isApplicantStatusSelected(): boolean {
        return this._policyListFilterModel != undefined && this._policyListFilterModel.selectedStatusCount != undefined;
    }

    private getApplicantStatusFilter(): CompositeANDFilter {
        const filters: Array<Filter> = [];
        const selectedAgingRange = this.getSelectedAgingRange();
        const applicantStatusDateFilter = new DateFilter(
            'ApplicantStatusDate',
            DateUtil.dateToString(selectedAgingRange.fromDate),
            DateUtil.dateToString(selectedAgingRange.toDate)
        );

        if (this.isSpecificAgingRangeSelected()) {
            filters.push(applicantStatusDateFilter);
            filters.push(new SimpleTextFilter('ApplicantStatusShort', this.getApplicantStatusShortName()));
            filters.push(new SimpleTextFilter('PolicyStatusCode', this.getPolicyStateCode()));
        } else {
            filters.push(applicantStatusDateFilter);
        }

        return this.prepareCompositeAndFilter(filters);
    }

    private isSpecificAgingRangeSelected(): boolean {
        return (
            this._policyListFilterModel.selectedStatusCount &&
            this._policyListFilterModel.selectedStatusCount.statusType != PolicyStatusType.Total
        );
    }

    private getApplicantStatusShortName(): string {
        return this._applicantStatusUtil.getApplicantStatusShortName(
            this._policyListFilterModel.selectedStatusCount.statusType
        );
    }

    private getPolicyStateCode(): string {
        return this._policyListFilterModel.selectedStatusCount.statusType == PolicyStatusType.ToBeIssued
            ? 'Closed'
            : 'Pending';
    }

    private getSelectedAgingRange(): AgingRangeDTO {
        return this._policyListFilterModel.selectedStatusCount.agingRanges.find(
            agingRange => agingRange.rangeType == this._policyListFilterModel.selectedStatusCount.selectedRange
        );
    }

    private prepareCompositeAndFilter(filters: Array<Filter>): CompositeANDFilter {
        return new CompositeANDFilter(filters);
    }

    private prepareCompositeOrFilter(filters: Array<Filter>): CompositeORFilter {
        return new CompositeORFilter(filters);
    }
}
