import { Component, Injector, Type } from '@angular/core';

import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { AppSession } from 'ls-core/session';
import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver,
    MasterButtonType
} from 'life-core/component/master-detail';
import { ResolvedDataNames } from 'life-core/view-model';
import {
    ModalDialogParams,
    ModalDialog,
    DirectDataResolve,
    DialogButtonType,
    DialogSize,
    ButtonActionType,
    ItemOpenMode
} from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { DBDateUtil } from 'ls-core/util';
import { MedicalConditionDTO, InsuredDTO } from 'ls-core/model';
import { AppMasterButtonType } from 'business/shared/master-detail';
import { BasePolicyMasterDetailViewModel, ApplicantListHelper, DebitCreditHelper } from 'business/policy/shared';

import { MedicalConditionItemFactory } from './medical-condition-item-factory';
import { MedicalConditionGridColumnsBuilder } from './medical-condition-grid-columns.builder';
import { MedicalConditionDetailCreatorComponent } from './detail/add/medical-condition-detail-creator.component';
import { MedicalConditionDetailDataResolver } from './detail/medical-condition-dialog-data.resolver';
import { MedicalConditionDetailEditorComponent } from './detail/edit/medical-condition-detail-editor.component';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { AuthorizationLevel } from 'life-core/authorization';

export function itemRowManagementDelegateFactory(
    itemFactory: MedicalConditionItemFactory,
    dataManager: BaseDataManager<MedicalConditionDTO>
): RowManagementDelegate<MedicalConditionDTO> {
    return new RowManagementDelegate({
        itemName: 'Medical Condition',
        itemIDPropertyName: 'MedicalConditionId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function medicalConditionItemComponentResolverFactory(): MasterDetailComponentResolver<MedicalConditionDTO> {
    const componentMap = new Map<string, Type<any>>();
    componentMap.set(
        MasterDetailComponentResolver.getItemCompositeKey(null, ItemOpenMode.Edit),
        MedicalConditionDetailEditorComponent
    );
    return new MasterDetailComponentResolver({
        itemComponents: componentMap
    });
}

@Component({
    selector: 'medical-condition',
    templateUrl: './medical-condition.component.html',
    providers: [
        BaseDataManager,
        MedicalConditionItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: itemRowManagementDelegateFactory,
            deps: [MedicalConditionItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: medicalConditionItemComponentResolverFactory
        },
        MedicalConditionGridColumnsBuilder
    ]
})
export class MedicalConditionComponent extends BasePolicyMasterDetailViewModel<MedicalConditionDTO> {
    public medicalConditionTotalPoints: number;
    private _debitCreditHelper: DebitCreditHelper;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;
    private _medicalConditionItemFactory: MedicalConditionItemFactory;
    private _applicant: InsuredDTO;
    private _modalDialog: ModalDialog;

    constructor(
        injector: Injector,
        modalDialog: ModalDialog,
        appSession: AppSession,
        debitCreditHelper: DebitCreditHelper,
        medicalConditionGridColumnsBuilder: MedicalConditionGridColumnsBuilder,
        medicalConditionItemFactory: MedicalConditionItemFactory,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);

        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._debitCreditHelper = debitCreditHelper;
        this._gridColumnsBuilder = medicalConditionGridColumnsBuilder;
        this._medicalConditionItemFactory = medicalConditionItemFactory;
        this._applicantListHelper = applicantListHelper;
        this.i18n = i18n;
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setActiveApplicant();
        this.setOtherMedicalConditionTotalPoints();
        return Promise.resolve();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.setupNoteButtonAuthorization();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): MedicalConditionDTO[] {
        return this._applicant.MedicalConditions_LazyLoad;
    }

    protected getRowNodeId(data: MedicalConditionDTO): any {
        return data.MedicalConditionId;
    }

    protected getPopupDetailButtons(): MasterButton<MedicalConditionDTO>[] {
        // Add Master Button
        const addMasterButton = new MasterButton({ type: MasterButtonType.ADD });
        addMasterButton.handler = () => {
            this.addMasterButtonHandler();
        };

        // Edit Master Button
        const editMasterButton = new MasterButton({ type: MasterButtonType.EDIT });
        editMasterButton.disableHandler = (item: MedicalConditionDTO): boolean => {
            return this.actionButtonDisableHandler(item);
        };

        // Copy Master Button
        const copyMasterButton = new MasterButton({ type: MasterButtonType.COPY });
        copyMasterButton.handler = (item: MedicalConditionDTO) => {
            this.copyMasterButtonHandler(item);
        };
        copyMasterButton.disableHandler = (item: MedicalConditionDTO): boolean => {
            return this.actionButtonDisableHandler(item);
        };

        // Void Master Button
        const voidMasterButton = new MasterButton({ type: AppMasterButtonType.VOID });
        voidMasterButton.handler = (item: MedicalConditionDTO) => {
            this.voidMasterButtonHandler(item);
        };
        voidMasterButton.disableHandler = (item: MedicalConditionDTO): boolean => {
            return this.actionButtonEnableHandler(item);
        };

        // Note Master Button
        const noteMasterButton = new MasterButton({ type: AppMasterButtonType.NOTE });
        noteMasterButton.actionType = ButtonActionType.DataChange;
        noteMasterButton.handler = () => {
            this.noteMasterButtonHandler();
        };
        // disable when authorization level is VIEW
        noteMasterButton.disableHandler = () => {
            return (
                !noteMasterButton.authorizationLevel || noteMasterButton.authorizationLevel === AuthorizationLevel.VIEW
            );
        };

        // Delete Master Button
        const deleteMasterButton = new MasterButton({ type: MasterButtonType.DELETE });
        deleteMasterButton.disableHandler = (item: MedicalConditionDTO): boolean => {
            return this.actionButtonDisableHandler(item);
        };

        return [
            addMasterButton,
            editMasterButton,
            copyMasterButton,
            voidMasterButton,
            noteMasterButton,
            deleteMasterButton
        ];
    }

    protected getItemDetailDialogResolve(item: MedicalConditionDTO): DirectDataResolve[] {
        return [
            {
                resolveName: ResolvedDataNames.listData,
                resolverClass: MedicalConditionDetailDataResolver,
                context: item
            }
        ];
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Medical Condition', id: 'policy.evidence.tab.label.medicalcond' });
    }

    protected getItemDetailDialogSize(): DialogSize | string {
        return DialogSize.large;
    }

    protected removeItem(item: MedicalConditionDTO): Promise<boolean> {
        return super.removeItem(item).then(result => {
            if (result) {
                this.setOtherMedicalConditionTotalPoints();
                return result;
            }
        });
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Large;
    }

    protected onItemDetailDialogOKClick(item: MedicalConditionDTO, dialogDirty: boolean): void {
        super.onItemDetailDialogOKClick(item, dialogDirty);
        this.setOtherMedicalConditionTotalPoints();
    }

    private setupNoteButtonAuthorization(): void {
        this.buttons.find(
            button => button.type === AppMasterButtonType.NOTE
        ).authorizationLevel = this.authorizationData.getLevel('addUWNote');
    }

    // private getCopyItemMessage(): string {
    //     return this.i18n({
    //         value:
    //             'Confirm if you want to create a copy of selected record. A copy of selected record will be created in the medical condition list',
    //         id: 'policy.evidence.medcond.copymessage'
    //     });
    // }

    private setActiveApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(
            this._appSession.policyDTO.Insureds_LazyLoad
        );
    }

    private setOtherMedicalConditionTotalPoints(): void {
        this.medicalConditionTotalPoints = this._debitCreditHelper.getMedicalConditionGridInfo(this._applicant).Total;
    }

    private addMasterButtonHandler(): any {
        const medicalConditionDTO = new MedicalConditionDTO();
        const addDialogParams: ModalDialogParams = {
            view: MedicalConditionDetailCreatorComponent,
            resolve: this.getItemDetailDialogResolve(medicalConditionDTO),
            title: this.getCreateItemDialogTitle(),
            buttons: this.getItemDetailDialogButtons(),
            data: medicalConditionDTO,
            size: DialogSize.large
        };
        this._modalDialog.open(addDialogParams).then(dialogRef => {
            dialogRef.result.then(result => {
                if (result.returnValue) {
                    this.addMedicalConditions(result.returnValue.selectedMedicalCondition);
                }
            });
        });
    }

    private copyMasterButtonHandler(item: MedicalConditionDTO): any {
        if (item === null) {
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
                    this.addMedicalCondition(item);
                }
            });
    }

    private voidMasterButtonHandler(item: MedicalConditionDTO): any {
        if (item === null) {
            return;
        }
        if (this.isSystemGenerated(item)) {
            this.rowManagementDelegate.saveRow(this.voidMedicalCondition(item));
            this.setOtherMedicalConditionTotalPoints();
        }
    }

    private noteMasterButtonHandler(): any {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddMedicalConditionUWNote,
            context: { isApplicantListDisabled: true, showApplicantStatus: false }
        });
    }

    private addMedicalConditions(values: MedicalConditionDTO[]): void {
        if (this._applicant.MedicalConditions_LazyLoad && values && values.length > 0) {
            values.forEach(value => {
                this._applicant.MedicalConditions_LazyLoad.push(this.createMedicalConditionDTO(value));
            });
            this.setModelDirty();
            this.refreshDetail();
        }
    }

    private addMedicalCondition(value: MedicalConditionDTO): void {
        if (this._applicant.MedicalConditions_LazyLoad && value) {
            this._applicant.MedicalConditions_LazyLoad.push(this.createMedicalConditionDTO(value));
            this.refreshDetail();
        }
    }

    private createMedicalConditionDTO(value: MedicalConditionDTO): MedicalConditionDTO {
        if (this._applicant.MedicalConditions_LazyLoad && value) {
            const medicalConditionDTO = this._medicalConditionItemFactory.newInstance({
                items: this._applicant.MedicalConditions_LazyLoad
            });
            medicalConditionDTO.BodilySystem = value.BodilySystem;
            medicalConditionDTO.Condition = value.Condition;
            medicalConditionDTO.Criteria = value.Criteria;
            medicalConditionDTO.TimeOfCriteria = value.TimeOfCriteria;
            medicalConditionDTO.IsSystemGenerated = 'false';
            medicalConditionDTO.AddedBy = this._appSession.user.UserId as number;
            medicalConditionDTO.Added = DBDateUtil.dateToDBDate(new Date()).dateAndTimeAsString;
            medicalConditionDTO.Points = value.Points;
            return medicalConditionDTO;
        }
    }

    private isSystemGenerated(medicalCondition: MedicalConditionDTO): boolean {
        return medicalCondition.IsSystemGenerated == 'true';
    }

    private refreshDetail(): void {
        this.refreshMasterDetail();
        this.setOtherMedicalConditionTotalPoints();
    }

    private voidMedicalCondition(medicalCondition: MedicalConditionDTO): MedicalConditionDTO {
        if (medicalCondition) {
            medicalCondition.Points = '0';
            medicalCondition.Override = 'true';
        }
        return medicalCondition;
    }

    private actionButtonEnableHandler(medicalCondition: MedicalConditionDTO): boolean {
        return medicalCondition
            ? !(this.isSystemGenerated(medicalCondition) && medicalCondition.Override == 'false')
            : !medicalCondition;
    }

    private actionButtonDisableHandler(medicalCondition: MedicalConditionDTO): boolean {
        return medicalCondition ? this.isSystemGenerated(medicalCondition) : !medicalCondition;
    }

    private setModelDirty(): void {
        // this needs to be done explicitly as we are using own add button handler ( not base class onCreateItem )
        this.changeManager.setIsDirty(true);
    }
}
