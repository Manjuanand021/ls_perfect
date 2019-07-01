import { Component, Injector } from '@angular/core';

import { ListItem } from 'life-core/model';
import {
    MasterButton,
    MasterButtonType,
    MasterButtonLabels,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver,
    CreateItemEventData
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import {
    ModalDialog,
    PopoverDialogParams,
    DialogButton,
    DialogButtonType,
    DialogSize,
    ConfirmDialog,
    DialogResult
} from 'life-core/component/dialog';
import { ButtonActionType } from 'life-core/component/shared';
import { ResolvedDataNames } from 'life-core/view-model';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, RequirementDTO, DBDate } from 'ls-core/model';
import { DefaultDataService, SetDefaultDataRequest, SavePolicyDataDelegate } from 'ls-core/service';
import { DBDateUtil } from 'ls-core/util';
import { AppMasterButtonType, AppMasterButtonLabels } from 'business/shared/master-detail';
import { PersonIdToPolicyPersonIdMapper } from 'business/policy/shared';

import {
    ActiveApplicantHelper,
    BasePolicyMasterDetailViewModel,
    ApplicantHelper,
    All_Applicants_Id,
    ApplicationCountersHelper
} from 'business/policy/shared';
import { IAutoNavigation, AutoNavigationManager } from 'ls-core/auto-navigation';
import { INavigationSequence, NavigationTarget, NavigationTargetTypes } from 'ls-core/model/auto-navigation';
import { RequirementGridColumnsBuilder } from './requirement-grid-columns.builder';
import { CreateRequirementDetail } from './create-requirement-detail';
import { RequirementItemFactory, RequirementCreateItemParams } from './requirement-item-factory';
import { TabViewRequirementDetailComponent } from './detail/tab/tab-view-requirement-detail.component';
import { RequirementHistoryComponent, RequirementHistoryMetaDataResolver } from './history';
import { RequirementMatchUnmatchChannels, MatchUnmatchType } from './match';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { AuthorizationProvider } from 'life-core/authorization';
import { ConvertUtil } from 'life-core/util/lang';
import { I18n } from 'life-core/i18n';
import { DropdownActionType } from 'life-core/component/input';

import { SaveMatchRequirementDataDelegate } from './save-match-requirement-data.delegate';
import { SaveUnmatchRequirementDataDelegate } from './save-unmatch-requirement-data.delegate';
import { AutoNavigationChannels } from 'business/shared/auto-navigation';
import { RequirementsAuthorizationProvider } from './requirements-authorization.provider';
import { RequirementStatuses } from './requirement-constants';
import { LfSplitPaneChannels, SplitPaneResult } from 'life-core/component/layout/split';
import { TabPolicySplitPaneAreas, TabPolicyDataKeys } from 'business/policy/tab';
import { TabStateValueAccessor, TabStateManager, DateUtil } from 'life-core/util';
import { SaveDataContext } from 'life-core/service';

export function rowManagementDelegateFactory(
    itemFactory: RequirementItemFactory,
    dataManager: BaseDataManager<RequirementDTO>
): RowManagementDelegate<RequirementDTO> {
    return new RowManagementDelegate({
        itemName: 'Requirement',
        itemIDPropertyName: 'InsuredRequirementId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<RequirementDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: TabViewRequirementDetailComponent
    });
}

@Component({
    selector: 'requirement',
    templateUrl: './requirement.component.html',
    providers: [
        BaseDataManager,
        RequirementItemFactory,
        PolicySubscriber,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [RequirementItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        RequirementGridColumnsBuilder,
        AutoNavigationManager,
        { provide: AuthorizationProvider, useClass: RequirementsAuthorizationProvider }
    ]
})
export class RequirementComponent extends BasePolicyMasterDetailViewModel<RequirementDTO> implements IAutoNavigation {
    public policy: PolicyDTO;
    public selectedApplicantId: number;
    public applicantListOptions: Array<ListItem>;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _confirmDialog: ConfirmDialog;
    private _selectedRequirementCode: string;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _requirementCode: string;
    private _defaultDataService: DefaultDataService;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _modalDialog: ModalDialog;
    private _messagingService: IMessagingService;
    private _matchUnmatchType: string;
    private _matchedRequirement: RequirementDTO;
    private _autoNavigationManager: AutoNavigationManager;
    private _masterButtonLabels: MasterButtonLabels;
    private _lsMasterButtonLabels: AppMasterButtonLabels;
    private _requirementStateValueAccessor: TabStateValueAccessor<string>;
    private _applicationCountersHelper: ApplicationCountersHelper;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        confirmDialog: ConfirmDialog,
        masterButtonLabels: MasterButtonLabels,
        lsMasterButtonLabels: AppMasterButtonLabels,
        activeApplicantHelper: ActiveApplicantHelper,
        defaultDataService: DefaultDataService,
        requirementGridColumnsBuilder: RequirementGridColumnsBuilder,
        messagingService: MessagingService,
        autoNavigationManager: AutoNavigationManager,
        applicationCountersHelper: ApplicationCountersHelper,
        tabStateManager: TabStateManager,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._activeApplicantHelper = activeApplicantHelper;
        policySubscriber.subscribe(this, p => {
            this.policy = p;
            if (this.gridOptions) {
                this.refreshMasterDetail();
            }
        });
        this._defaultDataService = defaultDataService;
        this._gridColumnsBuilder = requirementGridColumnsBuilder;
        this._messagingService = messagingService;
        this._autoNavigationManager = autoNavigationManager;
        this._applicationCountersHelper = applicationCountersHelper;
        this.applicantListOptions = new Array<ListItem>();
        this._modalDialog = modalDialog;
        this._confirmDialog = confirmDialog;
        this._masterButtonLabels = masterButtonLabels;
        this._lsMasterButtonLabels = lsMasterButtonLabels;
        this._requirementStateValueAccessor = new TabStateValueAccessor<string>(
            tabStateManager,
            TabPolicyDataKeys.ACTIVE_REQUIREMENT
        );
        this.registerHandlers();
    }

    public registerHandlers(): void {
        this.trackSubscription(
            this._messagingService.subscribeNewMessageOnly(
                RequirementMatchUnmatchChannels.RequirementMatchUnmatch,
                matchUnmatchInformation => this.onMatchSelectionReceived(matchUnmatchInformation)
            )
        );

        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setActiveApplicant(activeApplicantId);
            })
        );

        this.trackSubscription(
            this.messagingService.subscribe(LfSplitPaneChannels.RemoveSplitPaneArea, splitPaneResult => {
                this.onRequirementNoteSplitPaneClose(splitPaneResult);
            })
        );
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.loadApplicantList();
        return Promise.resolve();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initializeAutoNavigationChannel();
        this.restoreActiveRequirement();
    }

    public initializeAutoNavigationChannel(): void {
        this._autoNavigationManager.registerWithNavigationChannel(
            AutoNavigationChannels.Requirement,
            (sequence: INavigationSequence) => {
                this.processNavigationSequence(sequence);
            }
        );
    }

    public processNavigationSequence(sequence: INavigationSequence): void {
        const target = sequence.getNextNavigationTarget();
        if (target && target.targetType === NavigationTargetTypes.CollectionItem) {
            const policyPersonId = target.getParam(NavigationTarget.PARAM_PERSON_ID);
            const activeRequirementId = target.getParam(NavigationTarget.PARAM_COLLECTION_ITEM_ID);

            // using setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError error
            setTimeout(() => {
                this.selectedApplicantId = ConvertUtil.toNumber(policyPersonId);
                this.filterRequirementList();
                this.showActiveRequirement(activeRequirementId);
            });

            this._autoNavigationManager.continueNavigation(sequence, target, AutoNavigationChannels.Requirement);
        }
    }

    private onRequirementNoteSplitPaneClose(splitPaneResult: SplitPaneResult): void {
        if (splitPaneResult.areaId === TabPolicySplitPaneAreas.AddRequirementCaseNote && splitPaneResult.dialogResult) {
            this.showActiveRequirement(splitPaneResult.dialogResult.returnValue);
        }
    }

    private restoreActiveRequirement(): void {
        const requirementId = this._requirementStateValueAccessor.getValue();
        if (requirementId) {
            this.showActiveRequirement(requirementId);
        }
    }

    public onApplicantChange(): void {
        if (this.selectedApplicantId != All_Applicants_Id) {
            // only update selected application in state when a particular applicant is selected.
            this.setActiveApplicantId();
        }
        this.filterRequirementList();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected get numHeaderRows(): number {
        return 2;
    }

    protected initRowManagementDelegate(): void {
        const self = this;
        const applicantFilter = function(item: RequirementDTO): boolean {
            return ConvertUtil.toNumber(self.selectedApplicantId) === All_Applicants_Id ||
                self.selectedApplicantId == null
                ? true
                : ConvertUtil.toNumber(item.PolicyPersonId) === ConvertUtil.toNumber(self.selectedApplicantId);
        };
        this.rowManagementDelegate.initDataManager(this.items, applicantFilter);
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Requirements', id: 'policy.requirement.requirements' });
    }

    private getSelectedRequirement(): RequirementDTO {
        return this.policy.Requirements_LazyLoad.find(
            req =>
                req.RequirementCode == this.selectedItem.RequirementCode &&
                req.InsuredRequirementId == this.selectedItem.InsuredRequirementId &&
                req.RequirementInformationId == this.selectedItem.RequirementInformationId
        );
    }

    protected getInlineDetailButtons(): MasterButton<RequirementDTO>[] {
        const customButtons: MasterButton<RequirementDTO>[] = [
            new MasterButton({ type: MasterButtonType.ADD }),
            new MasterButton({
                type: AppMasterButtonType.NOTE,
                label: this._lsMasterButtonLabels.button_note,
                actionType: ButtonActionType.DataChange,
                handler: () => {
                    const selectedRequirement = this.getSelectedRequirement();
                    this.saveData().then(() => {
                        this.showActiveRequirement(selectedRequirement.InsuredRequirementId.toString());
                        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
                            areaId: TabPolicySplitPaneAreas.AddRequirementCaseNote,
                            context: {
                                requirement: selectedRequirement,
                                parentNote: selectedRequirement.Note,
                                requirementList: this.listData.Requirement
                            }
                        });
                    });
                }
            }),
            new MasterButton({
                type: AppMasterButtonType.HISTORY,
                label: this._lsMasterButtonLabels.button_history,
                actionType: ButtonActionType.Presentation,
                handler: () => {
                    this._modalDialog.open({
                        view: RequirementHistoryComponent,
                        data: this.selectedItem.EvidenceStatuses_LazyLoad,
                        resolve: [
                            {
                                resolveName: ResolvedDataNames.metaData,
                                resolverClass: RequirementHistoryMetaDataResolver
                            }
                        ],
                        title: this.i18n({ value: 'History', id: 'policy.requirement.history.title' }),
                        buttons: [
                            new DialogButton({
                                type: DialogButtonType.CANCEL,
                                label: this.i18n({ value: 'Close', id: 'general.button.label.close' }),
                                options: { isDefault: true }
                            })
                        ],
                        size: DialogSize.large
                    });
                }
            }),
            new MasterButton({ type: MasterButtonType.CANCEL, label: this._masterButtonLabels.button_undo })
        ];

        const buttonAdd = customButtons.find(button => button.type === MasterButtonType.ADD);
        const dialogAddParams: PopoverDialogParams = {
            content: CreateRequirementDetail,
            title: this.i18n({ value: 'Create Requirement', id: 'policy.requirement.createRequirement.title' }),
            data: this.listData,
            buttons: [],
            handler: (result: DialogResult) => {
                this._selectedRequirementCode = result.returnValue;
                this.validateForSimilarRequirement();
            }
        };
        buttonAdd.dialog = dialogAddParams;

        return customButtons;
    }

    protected loadItems(): RequirementDTO[] {
        return this.policy.Requirements_LazyLoad;
    }

    protected getRowNodeId(data: RequirementDTO): string {
        return data.InsuredRequirementId.toString();
    }

    protected createItem(eventData: CreateItemEventData): Promise<RequirementDTO> {
        const requirement = new RequirementDTO();
        requirement.RequirementCode = this._requirementCode;
        requirement.PolicyPersonId = this.getApplicantForNewRequirement();
        requirement.FollowupDate = this.getCurrentDate();
        requirement.ClosedDisposition = RequirementStatuses.Open;
        const defaultDataRequest = new SetDefaultDataRequest(this.policy, requirement, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            return this.rowManagementDelegate.addNewRow({
                items: this.items,
                requirementDTO: data.workingDTO as RequirementDTO
            } as RequirementCreateItemParams<RequirementDTO>);
        });
    }

    protected onItemCreated(item: RequirementDTO): void {
        super.onItemCreated(item);
        this._applicationCountersHelper.incrementManualActionCounter(this.policy);
        item._counterIncreased = true;
    }

    protected onItemCanceled(item: RequirementDTO): void {
        super.onItemCanceled(item);
        this._applicationCountersHelper.decrementManualActionCounter(this.policy);
        item._counterIncreased = false;
    }

    protected getDataToSave(): Object {
        if (this._matchUnmatchType === MatchUnmatchType.Match || this._matchUnmatchType === MatchUnmatchType.Unmatch) {
            return { policy: this.policy, requirement: this._matchedRequirement };
        }
        return this.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        if (this._matchUnmatchType === MatchUnmatchType.Match) {
            return this.injector.get(SaveMatchRequirementDataDelegate);
        }
        if (this._matchUnmatchType === MatchUnmatchType.Unmatch) {
            return this.injector.get(SaveUnmatchRequirementDataDelegate);
        }
        return this.injector.get(SavePolicyDataDelegate);
    }

    private validateForSimilarRequirement(): void {
        const existingReqCode = this.items.find(
            item =>
                item.RequirementCode === this._selectedRequirementCode &&
                ConvertUtil.toNumber(item.PolicyPersonId) == this.selectedApplicantId
        );
        if (existingReqCode) {
            this.showSimilarRequirementExistsDialog();
        } else {
            this.createRequirement();
        }
    }

    private showSimilarRequirementExistsDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value:
                    'A similar requirement already exists for the insured on the case. To add, select OK, otherwise select Cancel',
                id: 'policy.requirement.RequirementAlreadyExist'
            }),
            title: this.i18n({
                value: 'Requirement Already Exists',
                id: 'policy.requirement.RequirementAlreadyExistTitle'
            }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    handler: () => {
                        this.createRequirement();
                    }
                }),
                new DialogButton({ type: DialogButtonType.CANCEL })
            ]
        });
    }

    private createRequirement(): void {
        this._requirementCode = this._selectedRequirementCode;
        this.getMasterDetail().master.createItem();
    }

    private onMatchSelectionReceived(matchUnmatchInformation: any): void {
        this.rowManagementDelegate.saveRow(matchUnmatchInformation.requirement);
        this._matchUnmatchType = matchUnmatchInformation.matchUnmatchType;
        this._matchedRequirement = matchUnmatchInformation.requirement;
        this.saveData();
    }

    private loadApplicantList(): void {
        if (this.policy.Insureds_LazyLoad) {
            if (this._isMoreThanOneApplicantPresentInPolicy()) {
                this._addAllApplicantsOption();
            }
            this._bindInsuredsToApplicantList();
        }
    }

    private _isMoreThanOneApplicantPresentInPolicy(): boolean {
        return this.policy.Insureds_LazyLoad.length > 1;
    }

    private getPolicyPersonIdFromPersonId(personId: number): number {
        return PersonIdToPolicyPersonIdMapper.getPolicyPersonIdFromPersonId(personId, this.policy);
    }

    private getPersonIdFromPolicyPersonId(policyPersonId: number): number {
        return PersonIdToPolicyPersonIdMapper.getPersonIdFromPolicyPersonId(policyPersonId, this.policy);
    }

    private _addAllApplicantsOption(): void {
        this.applicantListOptions.push(new ListItem('All Applicants', All_Applicants_Id.toString()));
    }

    private _bindInsuredsToApplicantList(): void {
        let applicantName: string;
        this.policy.Insureds_LazyLoad.forEach(applicant => {
            applicantName = ApplicantHelper.getApplicantFullName(applicant);
            this.applicantListOptions.push(new ListItem(applicantName, applicant.PolicyPersonId.toString()));
        });
    }

    private setActiveApplicant(activeApplicantId: number): void {
        if (activeApplicantId == null) {
            this.selectedApplicantId = All_Applicants_Id;
        } else {
            const activeApplicantPolicyPersonId = this.getPolicyPersonIdFromPersonId(activeApplicantId);
            if (this.selectedApplicantId != activeApplicantPolicyPersonId) {
                this.selectedApplicantId = activeApplicantPolicyPersonId;
            }
        }
        this.filterRequirementList();
    }

    private getApplicantForNewRequirement(): any {
        return this.selectedApplicantId == null || this.selectedApplicantId == All_Applicants_Id
            ? this.applicantListOptions[1].value
            : this.selectedApplicantId;
    }

    private showActiveRequirement(requirementId: string): void {
        const activeRequirement = this.items.find(item => this.getRowNodeId(item) === requirementId);
        if (activeRequirement) {
            setTimeout(() => {
                this.setActiveItem(activeRequirement);
            });
        }
    }

    private filterRequirementList(): void {
        if (this.getMasterDetail()) {
            this.rowManagementDelegate.applyFilter();
            this.getMasterDetail().master.clearSelection();
        }
    }

    private setActiveApplicantId(): void {
        const selectedApplicantPersonId = this.getPersonIdFromPolicyPersonId(this.selectedApplicantId);
        this._activeApplicantHelper.setActiveApplicantId(selectedApplicantPersonId);
    }

    public ngOnDestroy(): void {
        this.saveActiveRequirement();
        super.ngOnDestroy();
    }

    private saveActiveRequirement(): void {
        if (this.selectedItem) {
            const requirementId = this.getRowNodeId(this.selectedItem);
            this._requirementStateValueAccessor.setValue(requirementId);
        }
    }
    private getCurrentDate(): DBDate {
        const currentDate = DateUtil.truncateTimeFromDate(new Date());
        return DBDateUtil.dateToDBDate(currentDate);
    }
}
