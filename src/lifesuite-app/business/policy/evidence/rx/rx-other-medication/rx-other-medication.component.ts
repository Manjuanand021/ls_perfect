import { Component, Injector, Type } from '@angular/core';

import { PolicySubscriber, AppSession } from 'ls-core/session';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { PolicyDTO, InsuredDTO, MedicationDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel, ApplicantListHelper, DebitCreditHelper } from 'business/policy/shared';
import { AppMasterButtonType } from 'business/shared/master-detail';

import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver,
    MasterButtonType
} from 'life-core/component/master-detail';
import { DirectDataResolve, ItemOpenMode } from 'life-core/component/shared';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { ModalDialogParams, ModalDialog, DialogButtonType, DialogSize } from 'life-core/component';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { I18n } from 'life-core/i18n';

import { DBDateUtil } from 'ls-core/util';
import { RiskFactorSourceType } from 'business/policy/worksheet/debit-credit';
import { OtherMedicationDetailDataResolver } from './detail/other-medication-dialog-data.resolver';
import { OtherMedicationDetailCreatorComponent } from './detail/add/other-medication-detail-creator.component';
import { OtherMedicationDetailEditorComponent } from './detail/edit/other-medication-detail-editor.component';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';

import { RxOtherMedicationColumnsBuilder } from './rx-other-medication-grid-columns.builder';
import { RxOtherMedicationItemFactory } from './rx-other-medication-item-factory';

export function rowManagementDelegateFactory(
    itemFactory: RxOtherMedicationItemFactory,
    dataManager: BaseDataManager<MedicationDTO>
): RowManagementDelegate<MedicationDTO> {
    return new RowManagementDelegate({
        itemName: 'Other Medication',
        itemIDPropertyName: 'MedicationId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<MedicationDTO> {
    const componentMap = new Map<string, Type<any>>();
    componentMap.set(
        MasterDetailComponentResolver.getItemCompositeKey(null, ItemOpenMode.Edit),
        OtherMedicationDetailEditorComponent
    );
    return new MasterDetailComponentResolver({
        itemComponents: componentMap
    });
}

@Component({
    selector: 'rx-other-medication',
    templateUrl: './rx-other-medication.component.html',
    providers: [
        BaseDataManager,
        PolicySubscriber,
        RxOtherMedicationItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [RxOtherMedicationItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        RxOtherMedicationColumnsBuilder
    ]
})
export class RxOtherMedicationComponent extends BasePolicyMasterDetailViewModel<MedicationDTO> {
    public otherMedicationTotalPoints: number;
    private _applicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _applicantListHelper: ApplicantListHelper;
    private _rxOtherMedicationItemFactory: RxOtherMedicationItemFactory;
    private _appSession: AppSession;
    private _modalDialog: ModalDialog;
    private _debitCreditHelper: DebitCreditHelper;
    private _messagingService: IMessagingService;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        appSession: AppSession,
        debitCreditHelper: DebitCreditHelper,
        rxOtherMedicationColumnsBuilder: RxOtherMedicationColumnsBuilder,
        rxOtherMedicationItemFactory: RxOtherMedicationItemFactory,
        applicantListHelper: ApplicantListHelper,
        messagingService: MessagingService,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this.otherMedicationTotalPoints = 0;
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._debitCreditHelper = debitCreditHelper;
        this._gridColumnsBuilder = rxOtherMedicationColumnsBuilder;
        this._rxOtherMedicationItemFactory = rxOtherMedicationItemFactory;
        this._applicantListHelper = applicantListHelper;
        this._messagingService = messagingService;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setApplicant();
        this.setOtherMedicationTotalPoints();
        return Promise.resolve();
    }

    private setOtherMedicationTotalPoints(): void {
        this.otherMedicationTotalPoints = this._debitCreditHelper.getMedicationGridInfo(
            this._applicant,
            RiskFactorSourceType.USER_GENERATED
        ).Total;
    }

    private setApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getPopupDetailButtons(): MasterButton<MedicationDTO>[] {
        const addMasterButton = new MasterButton({ type: MasterButtonType.ADD });
        addMasterButton.handler = () => {
            this.addMasterButtonHandler();
        };
        const editMasterButton = new MasterButton({ type: MasterButtonType.EDIT });
        const copyMasterButton = new MasterButton({ type: MasterButtonType.COPY });
        copyMasterButton.handler = (item: MedicationDTO) => {
            this.copyMasterButtonHandler(item);
        };
        const noteMasterButton = new MasterButton({ type: AppMasterButtonType.NOTE });
        noteMasterButton.handler = () => {
            this.noteMasterButtonHandler();
        };
        const deleteMasterButton = new MasterButton({ type: MasterButtonType.DELETE });
        return [addMasterButton, editMasterButton, copyMasterButton, noteMasterButton, deleteMasterButton];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MedicationDTO): any {
        return data.MedicationId;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Other Medication', id: 'policy.case.othermed.title' });
    }

    protected loadItems(): MedicationDTO[] {
        return this._applicant.Medication_LazyLoad;
    }

    protected getItemDetailDialogResolve(item: MedicationDTO): DirectDataResolve[] {
        return [
            {
                resolveName: ResolvedDataNames.listData,
                resolverClass: OtherMedicationDetailDataResolver,
                context: item
            }
        ];
    }

    protected initRowManagementDelegate(): void {
        this.rowManagementDelegate.initDataManager(this.items, this.userMedicationFilter);
    }

    protected removeItem(item: MedicationDTO): Promise<boolean> {
        return super.removeItem(item).then(result => {
            if (result) {
                this.setOtherMedicationTotalPoints();
                return result;
            }
        });
    }

    protected onItemDetailDialogOKClick(item: MedicationDTO, dialogDirty: boolean): void {
        super.onItemDetailDialogOKClick(item, dialogDirty);
        this.setOtherMedicationTotalPoints();
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Large;
    }

    private addMasterButtonHandler(): any {
        const medicationDTO = new MedicationDTO();
        const addDialogParams: ModalDialogParams = {
            view: OtherMedicationDetailCreatorComponent,
            resolve: this.getItemDetailDialogResolve(medicationDTO),
            title: this.getCreateItemDialogTitle(),
            buttons: this.getItemDetailDialogButtons(),
            data: medicationDTO,
            size: DialogSize.large
        };
        this._modalDialog.open(addDialogParams).then(dialogRef => {
            dialogRef.result.then(result => {
                if (result.returnValue) {
                    this.addMedicationDTO(result.returnValue.selectedMedication);
                }
            });
        });
    }

    private copyMasterButtonHandler(item: MedicationDTO): any {
        if (item == null) {
            return;
        }
        this.confirmDialog
            .open({
                message: this.getCopyItemMessage(),
                title: this.getCopyItemDialogTitle(),
                buttons: this.getItemDetailDialogButtons()
            })
            .then(result => {
                const isRemoved = result.buttonId === DialogButtonType.ACCEPT;
                if (isRemoved) {
                    this.copyMedicationDTO(item);
                }
            });
    }

    private noteMasterButtonHandler(): any {
        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddUWNote,
            context: { isApplicantListDisabled: true }
        });
    }

    private addMedicationDTO(values: MedicationDTO[]): void {
        if (this._applicant.Medication_LazyLoad && values && values.length > 0) {
            values.forEach(value => {
                this._applicant.Medication_LazyLoad.push(this.createMedicationDTO(value));
            });
            this.setModelDirty();
            this.refreshDetail();
        }
    }

    private copyMedicationDTO(value: MedicationDTO): void {
        if (this._applicant.Medication_LazyLoad && value) {
            this._applicant.Medication_LazyLoad.push(this.createMedicationDTO(value));
            this.refreshDetail();
        }
    }

    private createMedicationDTO(value: MedicationDTO): MedicationDTO {
        if (this._applicant.Medication_LazyLoad && value) {
            const medicationDTO = this._rxOtherMedicationItemFactory.newInstance({
                items: this._applicant.Medication_LazyLoad
            });
            medicationDTO.Condition = value.Condition;
            medicationDTO.DrugName = value.DrugName;
            medicationDTO.IsSystemGenerated = 'false';
            medicationDTO.AddedBy = this._appSession.user.UserId as number;
            medicationDTO.Added = DBDateUtil.dateToDBDate(new Date()).dateAndTimeAsString;
            medicationDTO.Points = value.Points;
            return medicationDTO;
        }
    }

    private refreshDetail(): void {
        this.refreshMasterDetail(this.userMedicationFilter);
        this.setOtherMedicationTotalPoints();
    }

    private userMedicationFilter(medication: MedicationDTO): boolean {
        return medication.IsSystemGenerated !== 'true';
    }

    private setModelDirty(): void {
        // this needs to be done explicitly as we are using own add button handler ( not base class onCreateItem )
        this.changeManager.setIsDirty(true);
    }
}
