import { Component, Injector } from '@angular/core';

import {
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver,
    CreateItemEventData,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { DialogButton, DialogButtonType, DialogResult, ItemEventData, ButtonActionType } from 'life-core/component';
import {
    IGridColumnsBuilder,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions,
    IDataGridColumn
} from 'life-core/component/grid';
import { DirectDataResolve, ItemOpenMode } from 'life-core/component/shared';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { DefaultDataService, SetDefaultDataRequest, SavePolicyDataDelegate } from 'ls-core/service';
import { DateFormatter, DateUtil } from 'life-core/util';
import { I18n } from 'life-core/i18n';
import { ConvertUtil } from 'life-core/util/lang';

import { AppSession } from 'ls-core/session/app-session';
import { PolicyDTO, InsuredDTO, MIBCodingDTO, MetadataItem, DBDate } from 'ls-core/model';
import { DBDateUtil, MetadataUtil } from 'ls-core/util';
import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { RefreshPolicyHandler } from 'business/policy/shared/refresh-policy/refresh-policy.handler';
import { MIBMasterGridNodeIds, MIBItemNames } from '../mib.resources';
import { MIBCodingDetailDialogEditor } from './detail';
import { MIBCodingGridColumnsBuilder } from './mib-coding-grid-columns.builder';
import { MIBCodingItemFactory, MIBCodingCreateItemParams } from './mib-coding-item-factory';
import { MIBCodingMetaDataResolver } from './mib-coding-metadata.resolver';
import { MIBCodingValidationResultType } from './mib-coding-validation-result-type';
import { MIBCodingService, MibCodingSubmitResponse } from './mib-coding.service';
import { MibCodingSubmittedStatusType } from './mib-coding-submitted-status-type';

export function mibCodingRowManagementDelegateFactory(
    itemFactory: MIBCodingItemFactory,
    dataManager: BaseDataManager<MIBCodingDTO>
): RowManagementDelegate<MIBCodingDTO> {
    return new RowManagementDelegate({
        itemName: MIBItemNames.MIBCoding,
        itemIDPropertyName: MIBMasterGridNodeIds.SequenceNumber,
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function mibCodingItemComponentResolverFactory(): MasterDetailComponentResolver<MIBCodingDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: MIBCodingDetailDialogEditor
    });
}

@Component({
    selector: 'mib-coding',
    templateUrl: './mib-coding.component.html',
    providers: [
        BaseDataManager,
        MIBCodingItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: mibCodingRowManagementDelegateFactory,
            deps: [MIBCodingItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: mibCodingItemComponentResolverFactory
        },
        MIBCodingGridColumnsBuilder,
        MIBCodingService,
        RefreshPolicyHandler
    ]
})
export class MIBCodingComponent extends BasePolicyMasterDetailViewModel<MIBCodingDTO> {
    public submittedMIBCodings: MIBCodingDTO[];

    // this data is accessed in column builder
    public aus_users: MetadataItem[];

    public isSubmitCodesButtonEnabled: boolean;

    public isValidateButtonEnabled: boolean;

    public isMIBEVTEnabled: boolean;

    private _policy: PolicyDTO;

    private _applicantListHelper: ApplicantListHelper;

    private _defaultDataService: DefaultDataService;

    private _gridColumnsBuilder: IGridColumnsBuilder;

    private _mibCodingsService: MIBCodingService;

    private _activeApplicant: InsuredDTO;

    private _mibCodings: MIBCodingDTO[];

    private _totalMIBCodesAllowed: number = 50;

    private _refreshPolicyHandler: RefreshPolicyHandler;

    private _dateFormatter: DateFormatter;

    constructor(
        injector: Injector,
        appSession: AppSession,
        applicantListHelper: ApplicantListHelper,
        defaultDataService: DefaultDataService,
        gridColumnBuilder: MIBCodingGridColumnsBuilder,
        mibCodingService: MIBCodingService,
        refreshPolicyHandler: RefreshPolicyHandler,
        dateFormatter: DateFormatter,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._policy = appSession.policyDTO;
        this._applicantListHelper = applicantListHelper;
        this._defaultDataService = defaultDataService;
        this._gridColumnsBuilder = gridColumnBuilder;
        this._mibCodingsService = mibCodingService;
        this._refreshPolicyHandler = refreshPolicyHandler;
        this._dateFormatter = dateFormatter;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setActiveApplicant();
        this.setupMIBCodings();
        this.splitSubmittedMIBCodings();
        this.setMIBEVTEnabled();
        return Promise.resolve();
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    public onSubmitCodesClick(): void {
        this.invokeMIBCodingsSubmission();
        this.isSubmitCodesButtonEnabled = false; // IT37662 | IT36170
    }

    public onValidateCodesClick(): void {
        const totalMIBCodesForValidation = this.getCountOfCodesForValidation();
        if (totalMIBCodesForValidation > 0 && totalMIBCodesForValidation <= this._totalMIBCodesAllowed) {
            // save before validate
            this.saveData().then(() => {
                // we are sending complete list of codes, MT will filter pending codes
                this.validateMIBCodes(this._mibCodings);
            });
        } else if (totalMIBCodesForValidation === 0) {
            this.showConfirmDialog(
                this.getMibValidationDialogTitle(),
                this.i18n({
                    value:
                        'No MIB Code exists for Validation and Translation request, All MIB Codes have been sent to MIB for validation.',
                    id: 'policy.mib.validation.codes.nocodeexistsmsg'
                })
            );
        } else if (totalMIBCodesForValidation > this._totalMIBCodesAllowed) {
            this.showConfirmDialog(
                this.getMibValidationDialogTitle(),
                this.i18n(
                    {
                        value:
                            'Codes entered for validation are more than allowed batch size {{totalMIBCodesAllowed}}. Please remove additional codes and then validate.',
                        id: 'policy.mib.validation.codes.totalMIBCodesAllowednsg'
                    },
                    { totalMIBCodesAllowed: this._totalMIBCodesAllowed }
                )
            );
        }
    }

    public onValidateIconClick(mibCode: MIBCodingDTO): void {
        if (
            mibCode.MibValidationResult === null ||
            mibCode.MibValidationResult === MIBCodingValidationResultType.PENDING
        ) {
            if (this.unSavedMIBCodesExist(mibCode.MibCodes)) {
                this.showConfirmDialog(
                    this.getMibValidationDialogTitle(),
                    this.i18n({
                        value:
                            'Other Unsaved MIB Code(s) exists. Please save MIB Code(s) and then send this code for validation.',
                        id: 'policy.mib.validation.codes.unsavedexistsmsg'
                    })
                );
            } else {
                // save before validate
                this.saveData().then(() => {
                    this.validateMIBCodes([mibCode]);
                });
            }
        }
    }

    protected setupData(): void {
        this.setMaxCodeCountForValidation();
        this.enableActionButtons();
    }

    protected loadItems(): MIBCodingDTO[] {
        return this._mibCodings || [];
    }

    protected initRowManagementDelegate(): void {
        // filter only codes which are pending for submission
        this.rowManagementDelegate.initDataManager(this.items, coding => this.pendingCodesPredicate(coding));
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getGridColumnDefs(): IDataGridColumn[] {
        const gridColumns: DataGridColumns = this.getGridColumnsBuilder().build(this.isMIBEVTEnabled);
        return gridColumns.getLayout();
    }

    protected getRowNodeId(data: MIBCodingDTO): any {
        return data.SequenceNumber;
    }

    protected createItem(eventData: CreateItemEventData): Promise<MIBCodingDTO> {
        if (this.isMaxCodeCountReached(ItemOpenMode.Create)) {
            this.showMaxCodeReachedDialog();
            return;
        }
        const mibCodingDTO: MIBCodingDTO = this.rowManagementDelegate.addNewRow({
            items: this.items,
            policyPersonId: this._activeApplicant.PolicyPersonId,
            effectiveDate: DBDateUtil.dateToDBDate(new Date())
        } as MIBCodingCreateItemParams<MIBCodingDTO>);

        const defaultDataRequest = new SetDefaultDataRequest(this._policy, mibCodingDTO, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(mibCodingDTO, data.workingDTO as MIBCodingDTO);
            return mibCodingDTO;
        });
    }

    protected onItemDetailDialogOKClick(item: MIBCodingDTO, dialogDirty: boolean): void {
        super.onItemDetailDialogOKClick(item, dialogDirty);
        this.enableActionButtons();
    }

    protected onEditItem(eventData: ItemEventData<MIBCodingDTO>): void {
        if (this.isMaxCodeCountReached(ItemOpenMode.Edit)) {
            this.showMaxCodeReachedDialog();
            return;
        }
        super.onEditItem(eventData);
    }

    protected removeItem(item: MIBCodingDTO): Promise<boolean> {
        return super.removeItem(item).then(result => {
            if (result) {
                this.enableActionButtons();
                return result;
            }
        });
    }

    protected getItemDetailDialogResolve(item: MIBCodingDTO): DirectDataResolve[] {
        return [
            {
                resolveName: ResolvedDataNames.metaData,
                resolverClass: MIBCodingMetaDataResolver,
                context: item
            }
        ];
    }

    protected getTitle(): string {
        return this.i18n({
            value: 'MIB Codes Pending Submission',
            id: 'policy.mib.submitted.codes.pendingsectionlabel'
        });
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    protected getDataToSave(): any {
        return this._policy;
    }

    protected getPopupDetailButtons(): MasterButton<MIBCodingDTO>[] {
        return [
            new MasterButton({ type: MasterButtonType.ADD, actionType: ButtonActionType.DataChange }),
            new MasterButton({
                type: MasterButtonType.EDIT,
                actionType: ButtonActionType.DataChange,
                disableHandler: this.editButtonDisableHandler
            }),
            new MasterButton({ type: MasterButtonType.DELETE, actionType: ButtonActionType.DataChange })
        ];
    }

    private setActiveApplicant(): void {
        this._activeApplicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
        this.logger.log('MIB - Active Applicant', this._activeApplicant);
    }

    private setupMIBCodings(): void {
        this._mibCodings = this._activeApplicant.MibCodings_LazyLoad;
        this.logger.log('MIB Codings', this._mibCodings);
    }

    private setMIBEVTEnabled(): void {
        const mibEVTEnabled = MetadataUtil.getLabelByValue(this.listData['system'], 'MIBEVTEnabled');
        this.isMIBEVTEnabled = mibEVTEnabled && mibEVTEnabled.toUpperCase() === 'TRUE';
    }

    private setMaxCodeCountForValidation(): void {
        const mibEVTBatchSize = MetadataUtil.getLabelByValue(this.listData['system'], 'MIBEVTBatchSize');
        if (mibEVTBatchSize) {
            this._totalMIBCodesAllowed = ConvertUtil.toNumber(mibEVTBatchSize);
            if (this._totalMIBCodesAllowed > 50) {
                this._totalMIBCodesAllowed = 50; // MIB does not allow more than 50 codes in one batch for validation.
            }
        }
    }

    private enableActionButtons(): void {
        const pendingMibCodes = this.getPendingMIBCodes();
        this.logger.log('pending mib codes', pendingMibCodes);
        this.enableSubmitCodesButton(pendingMibCodes);
        this.enableValidateCodesButton(pendingMibCodes);
    }

    private enableSubmitCodesButton(pendingMibCodes: MIBCodingDTO[]): void {
        this.isSubmitCodesButtonEnabled = this.isMIBEVTEnabled
            ? pendingMibCodes && pendingMibCodes.length > 0
                ? !pendingMibCodes.some(mibCode => mibCode.MibValidationResult !== MIBCodingValidationResultType.VALID)
                : false
            : pendingMibCodes && pendingMibCodes.length > 0;
    }

    private enableValidateCodesButton(pendingMibCodes: MIBCodingDTO[]): void {
        this.isValidateButtonEnabled = this.isMIBEVTEnabled
            ? pendingMibCodes.some(mibCode => mibCode.MibValidationResult !== MIBCodingValidationResultType.VALID)
            : false;
    }

    private getPendingMIBCodes(): MIBCodingDTO[] {
        return this._mibCodings.filter(coding => {
            return this.pendingCodesPredicate(coding);
        });
    }

    private pendingCodesPredicate(coding: MIBCodingDTO): boolean {
        return coding.DateSent ? !this.isMibCodeSubmitted(coding.DateSent) : true;
    }

    private splitSubmittedMIBCodings(): void {
        this.submittedMIBCodings = this._mibCodings.filter((coding: MIBCodingDTO) =>
            this.isMibCodeSubmitted(coding.DateSent)
        );
        this.logger.log('Submitted MIB Codings', this.submittedMIBCodings);
    }

    public isMibCodeSubmitted(dateSent: DBDate): boolean {
        return (
            dateSent &&
            DateUtil.isDateSet(dateSent.datetime) &&
            !!this._dateFormatter.format(dateSent.dateAndTimeAsString, 'short')
        );
    }

    private invokeMIBCodingsSubmission(): void {
        if (this.duplicateCodesExists()) {
            this.showDuplicateCodesValidationDialog().then(() => {
                this.enableActionButtons();
            });
        } else if (this.submittedCodesExists()) {
            this.showCodesAlreadySubmittedValidationDialog().then(() => {
                this.enableActionButtons();
                this.performPolicyRefresh();
            });
        } else {
            // we are sending complete list of codes, MT will filter pending codes
            this._mibCodingsService
                .submitMIBCodings(
                    this._policy.PolicyId as number,
                    this._activeApplicant.PolicyPersonId as number,
                    this._mibCodings
                )
                .then((result: MibCodingSubmitResponse) => {
                    this.logger.log('MIB Submission response', result);
                    this.handleSubmitCodesResponse();
                });
        }
    }

    private handleSubmitCodesResponse(): void {
        this.showConfirmDialog(
            this.i18n({ value: 'MIB Codes Submission', id: 'policy.mib.submitted.codes.title' }),
            this.i18n({
                value: `The newly added codes will be moved to the 'Submitted MIB Codes' list after they have been successfully sent to MIB. 
        Results related to this transaction will be reported on the Case Notes or Case Log Screen after the transaction has completed.`,
                id: 'policy.mib.submitted.codes.confirmmsg'
            })
        );
        this.performPolicyRefresh();
    }

    private validateMIBCodes(pendingCodes: MIBCodingDTO[]): void {
        this.logger.log('MIB Codes being sent for validation.', pendingCodes);
        this._mibCodingsService
            .validateMIBCodes(
                this._policy.PolicyId as number,
                this._activeApplicant.PolicyPersonId as number,
                pendingCodes
            )
            .then((result: MibCodingSubmitResponse) => this.handleValidateCodesResponse(result));
    }

    private handleValidateCodesResponse(codesValidationResponse: MibCodingSubmitResponse): void {
        this.logger.log('MIB Validation response', codesValidationResponse);
        if (codesValidationResponse) {
            if (codesValidationResponse._totalCodesSubmitted > 0) {
                this.showConfirmDialog(
                    this.getMibValidationDialogTitle(),
                    this.i18n({
                        value: 'MIB Code Validation and Translation request have been successfully sent to MIB.',
                        id: 'policy.mib.validation.codes.confirmmsg'
                    })
                );
            } else if (codesValidationResponse._totalCodesSubmitted === 0 && codesValidationResponse._errorMessage) {
                this.showConfirmDialog(this.getMibValidationDialogTitle(), codesValidationResponse._errorMessage);
            }
        }
        this.performPolicyRefresh();
    }

    private performPolicyRefresh(): void {
        this._refreshPolicyHandler.setViewValidationDelegate(this.viewValidationDelegate);
        this._refreshPolicyHandler.execute();
    }

    private unSavedMIBCodesExist(mibCode: string): boolean {
        const pendingCodes = this.getPendingMIBCodes();
        const today = DBDateUtil.dateToDBDate(new Date());
        return pendingCodes.some(
            pendingMibCode =>
                pendingMibCode.MibCodes !== mibCode &&
                this._dateFormatter.format(pendingMibCode.DateAdded.dateAndTimeAsString) ===
                    this._dateFormatter.format(today.dateAndTimeAsString)
        );
    }

    private isMaxCodeCountReached(mode: ItemOpenMode): boolean {
        const totalMIBCodesForValidation = this.getCountOfCodesForValidation();
        return mode === ItemOpenMode.Create
            ? totalMIBCodesForValidation > this._totalMIBCodesAllowed
            : totalMIBCodesForValidation >= this._totalMIBCodesAllowed;
    }

    private showMaxCodeReachedDialog(): void {
        this.showConfirmDialog(
            this.getMibValidationDialogTitle(),
            this.i18n(
                {
                    value:
                        'Maximum codes {{totalMIBCodesAllowed}} entered for validation has been reached. Please validate and then enter any additional codes.',
                    id: 'policy.mib.maxcodereached.message'
                },
                { totalMIBCodesAllowed: this._totalMIBCodesAllowed }
            )
        );
    }

    private getCountOfCodesForValidation(): number {
        const pendingCodes = this.getPendingMIBCodes();
        const codesForValidation = pendingCodes.filter(
            mibCode => mibCode.MibValidationResult === null || mibCode.MibValidationResult === 0
        );
        return codesForValidation ? codesForValidation.length : 0;
    }

    private showConfirmDialog(title: string, message: string): Promise<DialogResult> {
        return this.confirmDialog.open({
            message: message,
            title: title,
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private getMibValidationDialogTitle(): string {
        return this.i18n({
            value: 'MIB Code Validation and Translation',
            id: 'policy.mib.validation.codes.confirmmsg.title'
        });
    }
    private showDuplicateCodesValidationDialog(): Promise<DialogResult> {
        return this.showConfirmDialog(
            this.getMibValidationDialogTitle(),
            this.i18n({
                value: 'Trying to submit duplicate codes. Please remove duplicate codes.',
                id: 'policy.mib.duplicatecode.message'
            })
        );
    }
    private showCodesAlreadySubmittedValidationDialog(): Promise<DialogResult> {
        return this.showConfirmDialog(
            this.getMibValidationDialogTitle(),
            this.i18n({
                value: 'Trying to submit codes which are already submitted.',
                id: 'policy.mib.codesalreadysubmitted.message'
            })
        );
    }

    private duplicateCodesExists(): boolean {
        const uniqueMIBCodes = new Set<string>(this._mibCodings.map(mibCoding => mibCoding.MibCodes));
        return this._mibCodings.length != uniqueMIBCodes.size;
    }
    private submittedCodesExists(): boolean {
        return this._mibCodings.some(code => code.SubmittedStatus == MibCodingSubmittedStatusType.SUBMITTED);
    }

    private editButtonDisableHandler(mibCode: MIBCodingDTO): boolean {
        if (mibCode) {
            return mibCode.MibValidationResult === MIBCodingValidationResultType.PENDING ? false : true;
        } else {
            return true;
        }
    }
}
