import { Component, Injector } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { MedicationDTO } from 'ls-core/model';
import { OtherMedicationService } from 'business/policy/evidence/rx/rx-other-medication/rx-other-medication.service';
import { ListDataUtil, ListDataItem } from 'ls-core/service';
import { DBDateUtil } from 'ls-core/util';
import { AppSession } from 'ls-core/session';
import { OtherMedicalConditionTypes } from 'business/policy/evidence/rx/rx.constants';
import { DialogViewModelResult } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { RxDetailAuthorizationProvider } from './../../rx-detail-authorization.provider';

export const OTHER_STRING_LENGTH = 6;

@Component({
    selector: 'rx-other-medication-editor',
    templateUrl: './other-medication-detail-editor.component.html',
    providers: [
        ParentChildRegistry,
        OtherMedicationService,
        { provide: AuthorizationProvider, useClass: RxDetailAuthorizationProvider }
    ]
})
export class OtherMedicationDetailEditorComponent extends BasePolicyDialogDetailViewModel<MedicationDTO> {
    public medicationDTO: MedicationDTO[];
    public drugNameListItems: ListDataItem[];
    public medicalConditionValue: string;
    public otherMedicalConditionValue: string;
    public drugNameValue: string;
    public otherDrugNameValue: string;
    public otherMedicalConditionSelected: boolean;
    public otherDrugNameSelected: boolean;
    public showOtherDrug: boolean;
    private _otherMedicationService: OtherMedicationService;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession, otherMedicationService: OtherMedicationService) {
        super(injector);
        this._otherMedicationService = otherMedicationService;
        this._appSession = appSession;
        this.drugNameListItems = new Array<ListDataItem>();
    }

    public loadData(): Promise<void> {
        this.getMedicationDataLists();
        this.setOtherMedications();
        return Promise.resolve();
    }

    public onMedicalConditionChange(selectedCondition: any): void {
        this.setOnMedicalConditionChange();
        if (selectedCondition.value) {
            if (selectedCondition.value === OtherMedicalConditionTypes.Other) {
                this.drugNameValue = OtherMedicalConditionTypes.Other;
                this.data.Points = this.getDebitCreditPoints(this.drugNameValue);
                this.otherMedicalConditionSelected = true;
                this.otherDrugNameSelected = true;
                this.setShowOtherDrug();
            } else {
                this.otherMedicalConditionSelected = false;
                this.otherDrugNameSelected = false;
                this.setShowOtherDrug();
                this.data.Condition = selectedCondition.value;
                this.getMedicationDataLists();
            }
        }
    }

    public onDrugNameChange(selectedDrugName: any): void {
        this.setOnDrugNameChange();
        if (selectedDrugName.value) {
            this.data.Points = this.getDebitCreditPoints(selectedDrugName.value);
            this.otherDrugNameSelected = selectedDrugName.value === OtherMedicalConditionTypes.Other ? true : false;
            this.setShowOtherDrug();
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            this.data.Condition = this.otherMedicalConditionSelected
                ? `${OtherMedicalConditionTypes.Other}-${this.otherMedicalConditionValue}`
                : this.medicalConditionValue;
            this.data.DrugName = this.otherDrugNameSelected
                ? `${OtherMedicalConditionTypes.Other}-${this.otherDrugNameValue}`
                : this.drugNameValue;
        }
        return super.onDialogButtonClick(buttonId);
    }

    private setOnMedicalConditionChange(): void {
        this.drugNameValue = '';
        this.otherDrugNameValue = '';
        this.otherMedicalConditionValue = '';
        this.data.Points = '0';
    }

    private setOnDrugNameChange(): void {
        this.data.Points = '0';
        this.otherDrugNameValue = '';
        this.data.Updated = DBDateUtil.dateToDBDate(new Date()).dateAndTimeAsString;
        this.data.UpdatedBy = this._appSession.user.UserId as number;
    }

    private setShowOtherDrug(): void {
        this.showOtherDrug = this.otherMedicalConditionSelected || this.otherDrugNameSelected;
    }

    private getMedicationDataLists(): void {
        this._otherMedicationService.getMedicationList(this.data).then(response => {
            this.setupMedication(response.objectList as MedicationDTO[]);
        });
    }

    private setupMedication(medicationDTO: MedicationDTO[]): void {
        this.medicationDTO = medicationDTO;
        this.setupDrugNameList();
    }

    private setupDrugNameList(): void {
        this.drugNameListItems = this.medicationDTO.map(
            medication => new ListDataItem(medication.DrugName, medication.DrugName, medication.Points.toString())
        );
        ListDataUtil.addListDataItem(
            this.drugNameListItems,
            OtherMedicalConditionTypes.Other,
            OtherMedicalConditionTypes.Other,
            '0'
        );
    }

    private getDebitCreditPoints(value: string): string {
        return ListDataUtil.getExternalCodeFromListDataById(this.drugNameListItems, value);
    }

    private setOtherMedications(): void {
        this.otherMedicationData();
        this.setShowOtherDrug();
    }

    private otherMedicationData(): void {
        this.otherMedicalConditionValue = this.getOtherMedications(this.data.Condition);
        this.otherDrugNameValue = this.getOtherMedications(this.data.DrugName);
        this.medicalConditionValue = this.otherMedicalConditionValue
            ? OtherMedicalConditionTypes.Other
            : this.data.Condition;
        this.drugNameValue =
            this.otherMedicalConditionSelected || this.otherDrugNameValue
                ? OtherMedicalConditionTypes.Other
                : this.data.DrugName;
        this.otherMedicalConditionSelected = !!this.otherMedicalConditionValue;
        this.otherDrugNameSelected = !!this.otherDrugNameValue;
    }

    private getOtherMedications(value: string): string {
        if (value && value.indexOf(OtherMedicalConditionTypes.Other) !== -1) {
            return value.substr(OTHER_STRING_LENGTH);
        }
    }
}
