import { Component, Injector, ViewChild } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { MedicationDTO } from 'ls-core/model';
import { OtherMedicationService } from 'business/policy/evidence/rx/rx-other-medication/rx-other-medication.service';
import {
    DialogViewModelResult,
    DialogResult,
    DialogButton,
    DialogButtonType,
    ConfirmDialog
} from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { OtherMedicationDataListComponent } from './other-medication-data-list.component';
import { OtherMedicalConditionTypes } from 'business/policy/evidence/rx/rx.constants';
import { OtherDrugMedicationDataListComponent } from './other-drug/other-drug-medication-data-list.component';
import { AuthorizationProvider } from 'life-core/authorization';
import { RxDetailAuthorizationProvider } from './../../rx-detail-authorization.provider';

@Component({
    selector: 'rx-other-medication-editor',
    templateUrl: './other-medication-detail-creator.component.html',
    providers: [
        ParentChildRegistry,
        OtherMedicationService,
        { provide: AuthorizationProvider, useClass: RxDetailAuthorizationProvider }
    ]
})
export class OtherMedicationDetailCreatorComponent extends BasePolicyDialogDetailViewModel<MedicationDTO> {
    public medicationDTO: MedicationDTO[];
    public otherDrugMedicationDTO: MedicationDTO[];
    public disableOtherMedication: boolean;
    public isOtherMedication: boolean;
    public isNewMedicalCondition: boolean;
    public newMedicalConditionValue: string;
    protected confirmDialog: ConfirmDialog;
    @ViewChild(OtherMedicationDataListComponent)
    private _otherMedicationDataListComponent: OtherMedicationDataListComponent;

    @ViewChild(OtherDrugMedicationDataListComponent)
    private _otherDrugMedicationDataListComponent: OtherDrugMedicationDataListComponent;
    private _otherMedicationService: OtherMedicationService;

    constructor(injector: Injector, otherMedicationService: OtherMedicationService, confirmDialog: ConfirmDialog) {
        super(injector);
        this.confirmDialog = confirmDialog;
        this.i18n = injector.get(I18n);
        this._otherMedicationService = otherMedicationService;
        this.disableOtherMedication = true;
    }

    public loadData(): Promise<void> {
        this.data.Condition = '';
        return Promise.resolve();
    }

    public onMedicalConditionChange(selectedCondition: any): void {
        this.isOtherMedication = false;
        this.otherDrugMedicationDTO = new Array<MedicationDTO>();
        if (selectedCondition.value === OtherMedicalConditionTypes.Other) {
            this.isNewMedicalCondition = true;
        } else {
            this.setMedicationDataLists();
            this.isNewMedicalCondition = false;
            this.disableOtherMedication = false;
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            const isDirty = this.isDirty();
            const otherMedications = this.getOtherMedications();
            const selectedMedication = otherMedications
                ? { selectedMedication: otherMedications }
                : { selectedMedication: null };
            if (this._otherDrugMedicationDataListComponent) {
                this._otherDrugMedicationDataListComponent.saveData();
            }
            if (
                this.data.Condition === undefined ||
                this.data.Condition === '' ||
                (selectedMedication.selectedMedication && selectedMedication.selectedMedication.length > 0)
            ) {
                return this.validate().then(result => {
                    return new DialogViewModelResult(selectedMedication, result === ViewValidationResult.pass, isDirty);
                });
            } else {
                this.confirmSelection();
                return Promise.resolve(new DialogViewModelResult([], false));
            }
        } else {
            return Promise.resolve(null);
        }
    }

    private setMedicationDataLists(): void {
        this._otherMedicationService.getMedicationList(this.data).then(response => {
            this.setupMedication(response.objectList as MedicationDTO[]);
        });
    }

    private setupMedication(medicationDTO: MedicationDTO[]): void {
        this.medicationDTO = medicationDTO;
    }

    private getOtherMedications(): MedicationDTO[] {
        if (this.data.Condition !== undefined && this.data.Condition !== '') {
            const otherDrugMedicationsData = this.getOtherDrugMedications();
            return this.getSelectedMedication(otherDrugMedicationsData);
        }
    }

    private getOtherDrugMedications(): MedicationDTO[] {
        if (this.isOtherMedication || this.newMedicalConditionValue) {
            return this.otherDrugMedicationDTO.map(otherDrugMedication => {
                const newMedicalConditionValue = this.isNewMedicalCondition
                    ? `${OtherMedicalConditionTypes.Other}-${this.newMedicalConditionValue}`
                    : this.data.Condition;
                otherDrugMedication.Condition = newMedicalConditionValue;
                otherDrugMedication.DrugName =
                    otherDrugMedication.DrugName !== undefined
                        ? `${OtherMedicalConditionTypes.Other}-${otherDrugMedication.DrugName}`
                        : '';
                return otherDrugMedication;
            });
        }
    }

    private getSelectedMedication(otherDrugMedicationsData: MedicationDTO[]): MedicationDTO[] {
        return this.isNewMedicalCondition
            ? otherDrugMedicationsData
            : otherDrugMedicationsData
            ? this._otherMedicationDataListComponent.selectedMedication.concat(otherDrugMedicationsData)
            : this._otherMedicationDataListComponent.selectedMedication;
    }

    private confirmSelection(): Promise<DialogResult> {
        return this.confirmDialog.open({
            title: this.getConfirmDialogTitle(),
            message: this.getConfirmDialogMessage(),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private getConfirmDialogTitle(): string {
        return this.i18n({
            value: 'Warning',
            id: 'policy.rxothermedication.dialog.warning.title'
        });
    }

    private getConfirmDialogMessage(): string {
        return this.i18n({
            value: 'No medication selected.',
            id: 'policy.rxothermedication.dialog.warning.message'
        });
    }
}
