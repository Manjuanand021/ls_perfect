import { Component, Injector, EventEmitter, Output, Input } from '@angular/core';

import { ViewModel } from 'life-core/view-model/view-model';
import { TabStateValueAccessor } from 'life-core/util/tab-state/tab-state-value.accessor';
import { TabStateManager } from 'life-core/util/tab-state/tab-state.manager';
import { MessagingService } from 'life-core/messaging/messaging.service';
import { ListItem } from 'life-core/model';
import { ConvertUtil } from 'life-core/util/lang/convert.util';
import { DropdownActionType } from 'life-core/component/input';

import { AppSession } from 'ls-core/session/app-session';
import { PolicyDTO } from 'ls-core/model/dto/policy.dto';
import { MetadataItem } from 'ls-core/model/metadata/metadata.model';

import { ApplicantListHelper, All_Applicants_Id } from 'business/policy/shared';
import { PolicyViewType } from 'business/shared/view-type/policy-view-type';
import { CaseLogFilterModel } from './case-log-filter.model';
import { CaseLogFilterService } from './case-log-filter.service';
import { CaseLogViewDataKeys } from '../case-log-view-data-keys';

@Component({
    selector: 'case-log-filter',
    templateUrl: './case-log-filter.component.html',
    providers: [CaseLogFilterService]
})
export class CaseLogFilterComponent extends ViewModel {
    @Output()
    public filterChange: EventEmitter<CaseLogFilterModel> = new EventEmitter<CaseLogFilterModel>();
    @Input()
    public context: any;
    public filters: CaseLogFilterModel;
    public applicantsList: Array<ListItem>;
    public selectedView: PolicyViewType;
    public isApplicantDropDownVisible: boolean;
    public selectedApplicantId: string;
    public filterDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _policy: PolicyDTO;
    private _filtersStateValueAccessor: TabStateValueAccessor<CaseLogFilterModel>;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        appSession: AppSession,
        tabStateManager: TabStateManager,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        this._policy = appSession.policyDTO;
        this._applicantListHelper = applicantListHelper;
        this.createStateValueAccessors(tabStateManager);
        this.isApplicantDropDownVisible = false;
        this.applicantsList = [];
    }

    public onViewChange(view: any): void {
        this.toggleApplicantVisibility();
        this.buildSearchCriteria();
        if (view.label == 'Applicant') {
            this.selectedApplicantId = All_Applicants_Id.toString();
        }
        this.emitFilterModelChange();
    }

    public onApplicantChange(selectedApplicant: any): void {
        this.buildSearchCriteria(selectedApplicant.value);
        this.emitFilterModelChange();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this._filtersStateValueAccessor.setValue(this.filters);
    }

    protected setupData(): void {
        this.initFilters();
        this.setDefaultView();
        this.loadApplicantList();
        this.setDefaultData();
        this.buildSearchCriteria();
        this.emitFilterModelChange();
    }

    private toggleApplicantVisibility(): void {
        this.isApplicantDropDownVisible = this.selectedView == 0;
    }

    private initFilters(): void {
        this.filters = this._filtersStateValueAccessor.hasValue()
            ? this._filtersStateValueAccessor.getValue()
            : (this.filters = new CaseLogFilterModel());
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._filtersStateValueAccessor = new TabStateValueAccessor<CaseLogFilterModel>(
            tabStateManager,
            CaseLogViewDataKeys.CASE_LOG_FILTERS
        );
    }

    private setDefaultView(): void {
        this.setViewDropDownListItems();
        this.setViewListOption(this.listData['MyWorkViewDefault']);
    }

    private setViewDropDownListItems(): void {
        if (this.context.metaData.MyWorkView) {
            this.setListData(this.context.metaData);
        }
    }

    private setViewListOption(defaultViewMetadata: MetadataItem[]): void {
        this.selectedView = this.getCaseLogViewTypeFromMetadata(defaultViewMetadata);
    }

    private getCaseLogViewTypeFromMetadata(items: MetadataItem[]): PolicyViewType {
        return items[0].label == 'Applicant' ? PolicyViewType.Case : PolicyViewType.Applicant;
    }

    private emitFilterModelChange(): void {
        this.filterChange.emit(this.filters);
    }

    private loadApplicantList(): void {
        if (this._policy.Insureds_LazyLoad) {
            this.applicantsList = this._applicantListHelper.getApplicantList(this._policy.Insureds_LazyLoad, false);
            this.applicantsList.unshift(new ListItem('All Applicants', All_Applicants_Id.toString()));
        }
    }

    private setDefaultData(): void {
        this.filters.policyId = ConvertUtil.toNumber(this._policy.PolicyId);
    }

    // Referred flex 9.0
    private buildSearchCriteria(selectedApplicant?: number): void {
        if (this.isApplicantDropDownVisible && selectedApplicant) {
            this.filters.applicantId = selectedApplicant;
        } else if (this.isApplicantDropDownVisible && !selectedApplicant) {
            this.filters.applicantId = -1;
        } else if (!this.isApplicantDropDownVisible && this.selectedView == 1) {
            this.filters.applicantId = 0;
        }
    }
}
