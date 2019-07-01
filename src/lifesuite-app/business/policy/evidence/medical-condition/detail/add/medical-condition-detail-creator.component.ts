import { Component, Injector, ViewChild } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { MedicalConditionDTO } from 'ls-core/model';
import {
    DialogViewModelResult,
    DialogResult,
    DialogButton,
    DialogButtonType,
    ConfirmDialog
} from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { MedicalConditionDataListComponent } from './medical-condition-data-list.component';
import { OtherMedicalConditionTypes } from 'business/policy/evidence/rx/rx.constants';
import { MedicalConditionService } from '../../medical-condition.service';
import { MedicalConditionListDataResolver } from '../medical-condition-list-data.resolver';
import { DependentInputs } from '../dependent-inputs';
import { AuthorizationProvider } from 'life-core/authorization';
import { MedicalConditionPopupAuthorizationProvider } from '../medical-condition-popup-authorization.provider';
import { ListItem } from 'life-core/model';

class MedicalConditionDependentInput extends DependentInputs {
    public getDependencyValue(): string {
        return OtherMedicalConditionTypes.Other;
    }
}

@Component({
    selector: 'medical-condition-creator',
    templateUrl: './medical-condition-detail-creator.component.html',
    providers: [
        ParentChildRegistry,
        MedicalConditionService,
        MedicalConditionListDataResolver,
        { provide: AuthorizationProvider, useClass: MedicalConditionPopupAuthorizationProvider }
    ]
})
export class MedicalConditionDetailCreatorComponent extends BasePolicyDialogDetailViewModel<MedicalConditionDTO> {
    public medicalConditionList: MedicalConditionDTO[];
    @ViewChild(MedicalConditionDataListComponent)
    private _medicalConditionDataListComponent: MedicalConditionDataListComponent;
    private _medicalConditionListDataResolver: MedicalConditionListDataResolver;
    private _medicalConditionService: MedicalConditionService;
    public bodilyDependentInput: MedicalConditionDependentInput;
    public conditionDependentInput: MedicalConditionDependentInput;
    protected confirmDialog: ConfirmDialog;
    private _selectedCondition: string;

    constructor(
        injector: Injector,
        medicalConditionService: MedicalConditionService,
        medicalConditionListDataResolver: MedicalConditionListDataResolver,
        confirmDialog: ConfirmDialog
    ) {
        super(injector);
        this._medicalConditionService = medicalConditionService;
        this._medicalConditionListDataResolver = medicalConditionListDataResolver;
        this.bodilyDependentInput = new MedicalConditionDependentInput();
        this.conditionDependentInput = new MedicalConditionDependentInput();
        this.confirmDialog = confirmDialog;
        this.i18n = injector.get(I18n);
    }

    public onBodilySystemChange(selectedBodilySystem: any): void {
        this.resetMedicalConditionData();
        if (selectedBodilySystem.value) {
            const isOtherBodilySystem = this.isOtherValueSelected(selectedBodilySystem.value);
            const bodilySystemValue = isOtherBodilySystem ? '' : selectedBodilySystem.value;
            this.setBodilySystemControl(isOtherBodilySystem, bodilySystemValue, true);
            if (!isOtherBodilySystem) this.refreshMedicalConditionList();
        }
    }

    public onConditionChange(selectedCondition: ListItem): void {
        this.resetMedicalConditionData();
        if (selectedCondition.value) {
            const isOtherCondition = this.isOtherValueSelected(selectedCondition.value);
            const conditionValue = isOtherCondition ? '' : selectedCondition.value;
            this._selectedCondition = selectedCondition.value;
            this.setConditionControl(isOtherCondition, conditionValue, false, true);
            if (!isOtherCondition) this.setMedicalConditionGridData();
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            const isDirty = this.isDirty();
            const medicalConditions = this.getMedicalConditions();
            const selectedMedicalCondition = { selectedMedicalCondition: medicalConditions };
            if (this.isMedicalConditionRecordsAvailable()) {
                return this.validate().then(result => {
                    return new DialogViewModelResult(
                        selectedMedicalCondition,
                        result == ViewValidationResult.pass,
                        isDirty
                    );
                });
            } else {
                this.confirmSelection();
                return Promise.resolve(new DialogViewModelResult([], false));
            }
        } else {
            return Promise.resolve(null);
        }
    }

    private isMedicalConditionRecordsAvailable(): boolean {
        return (
            this.bodilyDependentInput.parentInput.value === '' ||
            this.bodilyDependentInput.parentInput.value === 'Other' ||
            this._selectedCondition === '' ||
            this._selectedCondition === 'Other' ||
            this.anyMedicalConditionSelected()
        );
    }

    private isMedicalConditionDataGridVisible(): boolean {
        return !(this.bodilyDependentInput.childInput.visible || this.conditionDependentInput.childInput.visible);
    }

    private isOtherValueSelected(value: string): boolean {
        return value === OtherMedicalConditionTypes.Other;
    }

    private setBodilySystemControl(isOtherControl: boolean, value: string, reset: boolean): void {
        this.resetMedicalConditionData();
        this.bodilyDependentInput.updateDependentInputs(isOtherControl, value, false, reset);
        if (isOtherControl || reset) this.setConditionControl(isOtherControl, '', true, reset);
    }

    private setConditionControl(isOtherControl: boolean, value: string, disable: boolean, reset: boolean): void {
        this.resetMedicalConditionData();
        this.conditionDependentInput.updateDependentInputs(isOtherControl, value, disable);
    }

    private resetMedicalConditionData(): void {
        this.data.Criteria = '';
        this.data.TimeOfCriteria = '';
        this.data.Points = '';
        this.medicalConditionList = new Array<MedicalConditionDTO>();
    }

    private refreshMedicalConditionList(): void {
        this.setMedicalConditionData();
        this._medicalConditionListDataResolver.context = this.data;
        this._medicalConditionListDataResolver.directResolve().then(data => {
            Object.assign(this.resolvedData.listData, data);
        });
    }

    private setMedicalConditionGridData(): void {
        this.setMedicalConditionData();
        this._medicalConditionService.getMedicalConditionList(this.data).then(response => {
            this.setupMedicalConditions(response.objectList as MedicalConditionDTO[]);
        });
    }

    private setupMedicalConditions(medicalConditions: MedicalConditionDTO[]): void {
        let medicalConditionIdCount = 0;
        medicalConditions.forEach(medicalCondition => {
            medicalCondition.MedicalConditionId = medicalConditionIdCount++;
        });
        this.medicalConditionList = medicalConditions;
    }

    private getMedicalConditions(): MedicalConditionDTO[] {
        return this.anyMedicalConditionSelected()
            ? this.getSelectedMedicalConditions()
            : this.getOtherMedicalConditionData();
    }

    private anyMedicalConditionSelected(): boolean {
        return (
            this._medicalConditionDataListComponent &&
            this._medicalConditionDataListComponent.selectedMedicalCondition.length > 0
        );
    }

    private getSelectedMedicalConditions(): MedicalConditionDTO[] {
        return this._medicalConditionDataListComponent.selectedMedicalCondition;
    }

    private getOtherMedicalConditionData(): MedicalConditionDTO[] {
        this.setMedicalConditionData();
        return [this.data];
    }

    private setMedicalConditionData(): void {
        this.data.BodilySystem = this.bodilyDependentInput.getDependentInputValue();
        this.data.Condition = this.conditionDependentInput.getDependentInputValue();
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
            id: 'policy.medicalcondition.dialog.warning.title'
        });
    }

    private getConfirmDialogMessage(): string {
        return this.i18n({
            value: 'No medical condition selected.',
            id: 'policy.medicalcondition.dialog.warning.message'
        });
    }
}
