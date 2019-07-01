import { Component, Injector } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { MedicalConditionDTO } from 'ls-core/model';
import { DialogViewModelResult } from 'life-core/component';
import { OtherMedicalConditionTypes } from 'business/policy/evidence/rx/rx.constants';
import { MedicalConditionService } from '../../medical-condition.service';
import { MedicalConditionListDataResolver } from '../medical-condition-list-data.resolver';
import { ListItem } from 'life-core/model';
import { DependentInputs } from '../dependent-inputs';
import { ListUtil } from 'life-core/util';
import { AuthorizationProvider } from 'life-core/authorization';
import { MedicalConditionPopupAuthorizationProvider } from './../medical-condition-popup-authorization.provider';

class MedicalConditionDependentInput extends DependentInputs {
    public getDependencyValue(): string {
        return OtherMedicalConditionTypes.Other;
    }
}

@Component({
    selector: 'medical-condition-editor',
    templateUrl: './medical-condition-detail-editor.component.html',
    providers: [
        ParentChildRegistry,
        MedicalConditionService,
        MedicalConditionListDataResolver,
        { provide: AuthorizationProvider, useClass: MedicalConditionPopupAuthorizationProvider }
    ]
})
export class MedicalConditionDetailEditorComponent extends BasePolicyDialogDetailViewModel<MedicalConditionDTO> {
    public bodilyDependentInput: MedicalConditionDependentInput;
    public conditionDependentInput: MedicalConditionDependentInput;
    public criteriaDependentInput: MedicalConditionDependentInput;
    public timeOfCriteriaDependentInput: MedicalConditionDependentInput;
    public debitCreditDependentInput: MedicalConditionDependentInput;
    private _medicalConditionListDataResolver: MedicalConditionListDataResolver;

    constructor(injector: Injector, medicalConditionListDataResolver: MedicalConditionListDataResolver) {
        super(injector);
        this._medicalConditionListDataResolver = medicalConditionListDataResolver;
        this.bodilyDependentInput = new MedicalConditionDependentInput();
        this.conditionDependentInput = new MedicalConditionDependentInput();
        this.criteriaDependentInput = new MedicalConditionDependentInput();
        this.timeOfCriteriaDependentInput = new MedicalConditionDependentInput();
        this.debitCreditDependentInput = new MedicalConditionDependentInput();
    }

    public onBodilySystemChange(selectedBodilySystem: any): void {
        if (selectedBodilySystem.value) {
            const isOtherBodilySystem = this.isOtherValueSelected(selectedBodilySystem.value);
            const bodilySystemValue = isOtherBodilySystem ? '' : selectedBodilySystem.value;
            this.setBodilySystemControl(isOtherBodilySystem, bodilySystemValue, true);
            if (!isOtherBodilySystem) this.getConditionCodeListData();
        }
    }

    public onConditionChange(selectedCondition: any): void {
        if (selectedCondition.value) {
            const isOtherCondition = this.isOtherValueSelected(selectedCondition.value);
            const conditionValue = isOtherCondition ? '' : selectedCondition.value;
            this.setConditionControl(isOtherCondition, conditionValue, false, true);
            if (!isOtherCondition) this.getConditionCodeListData();
        }
    }

    public onCriteriaChange(selectedCriteria: any): void {
        if (selectedCriteria.value) {
            const isOtherCriteria = this.isOtherValueSelected(selectedCriteria.value);
            const criteriaValue = isOtherCriteria ? '' : selectedCriteria.value;
            this.setCriteriaControl(isOtherCriteria, criteriaValue, false, true);
            if (!isOtherCriteria) this.getConditionCodeListData();
        }
    }

    public onTimeOfCriteriaChange(selectedTimeOfCriteria: any): void {
        if (selectedTimeOfCriteria.value) {
            const isOtherTimeOfCriteria = this.isOtherValueSelected(selectedTimeOfCriteria.value);
            const timeOfCriteriaValue = isOtherTimeOfCriteria ? '' : selectedTimeOfCriteria.value;
            this.setTimeOfCriteriaControl(isOtherTimeOfCriteria, timeOfCriteriaValue, false, true);
            if (!isOtherTimeOfCriteria) this.getConditionCodeListData();
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            this.setMedicalConditionData();
        }
        return super.onDialogButtonClick(buttonId);
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.initializeMedicalConditionData();
    }

    private initializeMedicalConditionData(): void {
        const bodilySystemData = this.getDropDownValue(this.resolvedData.listData.BodilySystem, this.data.BodilySystem);
        this.setBodilySystemControl(bodilySystemData.isNewItem, this.data.BodilySystem, false);
        const conditionData = this.getDropDownValue(this.resolvedData.listData.Condition, this.data.Condition);
        this.setConditionControl(conditionData.isNewItem, this.data.Condition, bodilySystemData.isNewItem, false);
        const criteriaData = this.getDropDownValue(this.resolvedData.listData.Criteria, this.data.Criteria);
        this.setCriteriaControl(criteriaData.isNewItem, this.data.Criteria, conditionData.isNewItem, false);
        const timeOfCriteriaData = this.getDropDownValue(
            this.resolvedData.listData.TimeOfCriteria,
            this.data.TimeOfCriteria
        );
        this.setTimeOfCriteriaControl(
            timeOfCriteriaData.isNewItem,
            this.data.TimeOfCriteria,
            criteriaData.isNewItem,
            false
        );
    }

    private isOtherValueSelected(value: string): boolean {
        return value === OtherMedicalConditionTypes.Other;
    }

    private setBodilySystemControl(isOtherControl: boolean, value: string, reset: boolean): void {
        this.bodilyDependentInput.updateDependentInputs(isOtherControl, value, false, reset);
        if (isOtherControl || reset) this.setConditionControl(isOtherControl, '', true, reset);
    }

    private setConditionControl(isOtherControl: boolean, value: string, disable: boolean, reset: boolean): void {
        this.conditionDependentInput.updateDependentInputs(isOtherControl, value, disable);
        if (isOtherControl || reset) this.setCriteriaControl(isOtherControl, '', true, reset);
    }

    private setCriteriaControl(isOtherControl: boolean, value: string, disable: boolean, reset: boolean): void {
        this.criteriaDependentInput.updateDependentInputs(isOtherControl, value, disable);
        if (isOtherControl || reset) this.setTimeOfCriteriaControl(isOtherControl, '', true, reset);
    }

    private setTimeOfCriteriaControl(isOtherControl: boolean, value: string, disable: boolean, reset: boolean): void {
        this.timeOfCriteriaDependentInput.updateDependentInputs(isOtherControl, value, disable);
        this.setDebitCreditControl(isOtherControl, reset ? '0' : this.data.Points.toString(), true, reset);
    }

    private setDebitCreditControl(isOtherControl: boolean, value: string, disable: boolean, reset: boolean): void {
        this.debitCreditDependentInput.updateDependentInputs(
            isOtherControl,
            value,
            disable,
            isOtherControl ? false : reset
        );
    }

    private getDropDownValue(listItem: Array<ListItem>, value: any): { isNewItem: boolean; itemValue: string } {
        const returnValue = { isNewItem: true, itemValue: OtherMedicalConditionTypes.Other };
        if (ListUtil.isItemExist(listItem, value)) {
            returnValue.itemValue = value;
            returnValue.isNewItem = false;
        }
        return returnValue;
    }

    private setMedicalConditionData(): void {
        this.data.BodilySystem = this.bodilyDependentInput.getDependentInputValue();
        this.data.Condition = this.conditionDependentInput.getDependentInputValue();
        this.data.Criteria = this.criteriaDependentInput.getDependentInputValue();
        this.data.TimeOfCriteria = this.timeOfCriteriaDependentInput.getDependentInputValue();
        this.data.Points = this.debitCreditDependentInput.getDependentInputValue();
    }

    private getConditionCodeListData(): void {
        this.setMedicalConditionData();
        this._medicalConditionListDataResolver.context = this.data;
        this._medicalConditionListDataResolver.directResolve().then(data => {
            Object.assign(this.resolvedData.listData, data);
            if (this.resolvedData.listData.Points && this.resolvedData.listData.Points.length > 0) {
                this.setDebitCreditControl(false, this.resolvedData.listData.Points[0].value, false, false);
            }
        });
    }
}
