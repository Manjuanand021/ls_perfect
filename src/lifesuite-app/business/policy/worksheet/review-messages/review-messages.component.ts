import { Component, Injector } from '@angular/core';

import {
    IDataGridOptions,
    DataGridColumns,
    IDataGridViewModel,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { ListItem } from 'life-core/model';
import { TabStateValueAccessor } from 'life-core/util/tab-state/tab-state-value.accessor';
import { AuthorizationProvider } from 'life-core/authorization';
import { LfSplitPaneChannels, SplitPaneResult } from 'life-core/component/layout/split';
import { TabStateManager } from 'life-core/util/tab-state';
import { DropdownActionType } from 'life-core/component/input';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, InsuredDTO, ReviewMessageDTO } from 'ls-core/model';

import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { LogPerformanceDelegate } from 'business/policy/shared/log-performance/log-performance.delegate';
import { ReviewMessagesAuthorizationProvider } from './review-messages-authorization.provider';
import { TabWorksheetDataKeys } from 'business/policy/worksheet/tab-worksheet-data-keys';
import { ReviewMessageDataContext } from './review-message-data-context';
import { ReviewMessagesListColumnsBuilder } from './review-messages-list-columns.builder';
import { ActiveApplicantHelper, ApplicantHelper } from 'business/policy/shared';

@Component({
    selector: 'review-messages',
    templateUrl: './review-messages.component.html',
    styleUrls: ['./review-messages.component.css'],
    providers: [
        PolicySubscriber,
        ReviewMessagesListColumnsBuilder,
        { provide: AuthorizationProvider, useClass: ReviewMessagesAuthorizationProvider }
    ]
})
export class ReviewMessagesComponent extends SecondaryTabHostViewModel implements IDataGridViewModel {
    public gridOptions: IDataGridOptions;
    public applicantListOptions: Array<ListItem>;
    public selectedApplicantId: number;
    public isOpenButtonDisabled: boolean;
    public rowCount: number;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _policy: PolicyDTO;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _activeReviewMessage: ReviewMessageDTO;
    private _gridColumnsBuilder: ReviewMessagesListColumnsBuilder;
    private _logPerformanceDelegate: LogPerformanceDelegate;
    private _performanceDataAlreadyLogged: boolean;
    private _performanceMetricValueAccessor: TabStateValueAccessor<boolean>;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        logPerformanceDelegate: LogPerformanceDelegate,
        tabStateManager: TabStateManager,
        activeApplicantHelper: ActiveApplicantHelper,
        reviewMessagesListColumnsBuilder: ReviewMessagesListColumnsBuilder
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this._policy = p;
            this.refreshGrid();
        });
        this.applicantListOptions = new Array<ListItem>();
        this._activeApplicantHelper = activeApplicantHelper;
        this._gridColumnsBuilder = reviewMessagesListColumnsBuilder;
        this.isOpenButtonDisabled = true;
        this._logPerformanceDelegate = logPerformanceDelegate;
        this.createStateValueAccessors(tabStateManager);
        this.initSubscribers();
        this._performanceDataAlreadyLogged = false;
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._performanceMetricValueAccessor = new TabStateValueAccessor<boolean>(
            tabStateManager,
            TabWorksheetDataKeys.REVIEW_MESSAGES
        );
    }

    private initSubscribers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(LfSplitPaneChannels.RemoveSplitPaneArea, splitPaneResult => {
                this.onNoteSplitPaneClose(splitPaneResult);
            })
        );
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setActiveApplicant(activeApplicantId);
            })
        );
    }

    private onNoteSplitPaneClose(splitPaneResult: SplitPaneResult): void {
        if (splitPaneResult.areaId == TabPolicySplitPaneAreas.AddReviewMessageNote) {
            this.refreshGrid();
        }
    }

    private setActiveApplicant(activeApplicantId: number): void {
        if (activeApplicantId == null) {
            const insured: any = this._policy.Insureds_LazyLoad.find(n => !!n.PrimaryInsuredFlag);
            this.selectedApplicantId = insured ? insured.PersonId : this._policy.Insureds_LazyLoad[0].PersonId;
            this._activeApplicantHelper.setActiveApplicantId(this.selectedApplicantId);
        } else {
            if (this.selectedApplicantId != activeApplicantId) {
                this.selectedApplicantId = activeApplicantId;
            }
        }
        this.filterReviewMessages();
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.restorePerformanceMetricFlag();
        this.loadApplicantList();
        this.gridOptions = this.getGridOptions();
        this.logPerformance();
        return Promise.resolve(null);
    }

    private restorePerformanceMetricFlag(): void {
        this._performanceDataAlreadyLogged = this._performanceMetricValueAccessor.hasValue()
            ? this._performanceMetricValueAccessor.getValue()
            : false;
    }

    private logPerformance(): void {
        if (!this._performanceDataAlreadyLogged) {
            this._logPerformanceDelegate.log(false, this._policy.PolicyNumber, 'caseOpen');
            this._performanceDataAlreadyLogged = true;
        }
    }

    public ngOnDestroy(): void {
        this._performanceMetricValueAccessor.setValue(this._performanceDataAlreadyLogged);
        super.ngOnDestroy();
    }

    public setupData(): void {
        this.setRowCount();
    }

    public getGridOptions(): IDataGridOptions {
        const gridColumns: DataGridColumns = this.getGridColumns();
        return DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: gridColumns.getLayout(),
                rowData: this.getRowData(),
                rowSelection: 'single',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                domLayout: 'autoHeight',
                showTotal: false,
                getRowHeight: this.getRowHeight
            },
            DataGridCommonOptions
        );
    }

    public getGridColumns(): DataGridColumns {
        const reviewMessagesDataContext = new ReviewMessageDataContext();
        reviewMessagesDataContext.policy = this._policy;
        reviewMessagesDataContext.applicant = this._policy.Insureds_LazyLoad[0];
        this._gridColumnsBuilder.setContext(reviewMessagesDataContext);
        return this._gridColumnsBuilder.build();
    }

    public onRowClicked($event: any): void {
        this.isOpenButtonDisabled = false;
        this._activeReviewMessage = this.getReviewMessageFromPolicy($event);
    }

    private getReviewMessageFromPolicy($event: any): ReviewMessageDTO {
        // need to retrieve this from policy as after every note is added, the policy is getting saved and need to get the note from updated policy object
        return this._policy.Insureds_LazyLoad.find(
            applicant => applicant.PersonId == this.selectedApplicantId
        ).ReviewMessages_LazyLoad.find(message => message.ReviewMessageId == $event.node.data.ReviewMessageId);
    }

    public onRowDoubleClicked($event: any): void {
        this.isOpenButtonDisabled = false;
        this.onRowClicked($event);
        this.openMessage($event.node.data);
    }

    public onApplicantChange(selectedApplicant: any): void {
        this._activeApplicantHelper.setActiveApplicantId(selectedApplicant.value);
        this.selectedApplicantId = selectedApplicant.value;
        this.filterReviewMessages();
    }

    private filterReviewMessages(): void {
        this.refreshGrid();
        this.setRowCount();
    }

    public openMessage(selectedReviewMessage: any): void {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddReviewMessageNote,
            context: { reviewMessage: this._activeReviewMessage, parentNote: this._activeReviewMessage.reviewNote }
        });
    }

    private loadApplicantList(): void {
        if (this._policy.Insureds_LazyLoad) {
            this._bindInsuredsToApplicantList();
        }
    }

    private _bindInsuredsToApplicantList(): void {
        let applicantName: string;
        this._policy.Insureds_LazyLoad.forEach(applicant => {
            applicantName = ApplicantHelper.getApplicantFullName(applicant);
            this.applicantListOptions.push(new ListItem(applicantName, applicant.PersonId.toString()));
        });
    }

    private getRowData(): any {
        return this.getReviewMessages();
    }

    private refreshGrid(): void {
        if (this.gridOptions) {
            this.gridOptions.api.setRowData(this.getRowData());
        }
    }

    private getReviewMessages(): Array<ReviewMessageDTO> {
        const selectedApplicant = this.getSelectedApplicant();
        const sortCompareFunction = this.getSortFunction(selectedApplicant.ReviewMessages_LazyLoad);
        return selectedApplicant ? selectedApplicant.ReviewMessages_LazyLoad.sort(sortCompareFunction) : [];
    }

    private getSortFunction<ReviewMessageDTO>(
        reviewMessages: Array<ReviewMessageDTO>
    ): (a: ReviewMessageDTO, b: ReviewMessageDTO) => number {
        return function sortFunc(a: ReviewMessageDTO, b: ReviewMessageDTO): number {
            return parseInt(a['MessageType']) - parseInt(b['MessageType']);
        };
    }

    private getSelectedApplicant(): InsuredDTO {
        return this._policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.selectedApplicantId);
    }

    private setRowCount(): void {
        if (this.gridOptions) {
            this.rowCount = this.gridOptions.api.getModel().getRowCount();
        }
    }

    private getRowHeight(params: any): number {
        return params.data.ReviewMessageComment && params.data.ReviewMessageComment !== ''
            ? RowHeight.Medium
            : RowHeight.Small;
    }
}

const RowHeight = {
    Small: 30,
    Medium: 50
};
