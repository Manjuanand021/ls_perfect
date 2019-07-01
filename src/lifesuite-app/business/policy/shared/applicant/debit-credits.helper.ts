import { Injectable } from '@angular/core';
import { InsuredDTO, MedicationDTO, MedicalConditionDTO, WorksheetRowDTO } from 'ls-core/model';
import { Origin } from 'ls-core/model';
import { RiskFactorSourceType } from '../../worksheet/debit-credit/const/risk-factor-source-types';
import { RiskFactorSystemGeneratedTypes } from '../../worksheet/debit-credit/const/risk-factor-system-generated-types';
import { GridInfo } from '../../worksheet/debit-credit/debit-credit-grid-info-model';
import { ConvertUtil } from 'life-core/util/lang';

/**
 * DebitCreditHelper provides access to totalDebitCreditPoints.
 * Registered globally to be accessible from components and resolvers.
 */
@Injectable()
export class DebitCreditHelper {
    constructor() {}

    public getDebitCreditTotalPoints(insured: InsuredDTO): number {
        return (
            this.getMedicalConditionsPoints(insured) +
            this.getMedicationPoints(insured) +
            this.getOtherRiskPoints(insured, false)
        );
    }

    public getOtherRiskPoints(insured: InsuredDTO, userGeneratedRows: boolean): number {
        let points = 0;
        insured.Coverages_LazyLoad.forEach(coverage => {
            if (coverage.WorksheetRows_LazyLoad) {
                points += this.getFilteredWorksheetRows(coverage.WorksheetRows_LazyLoad, userGeneratedRows).reduce(
                    this.getTotalDebitsPredicate,
                    0
                );
            }
        });
        return points;
    }

    public getRiskFactorGridInfo(insured: InsuredDTO, sourceType: number): GridInfo<WorksheetRowDTO> {
        let riskFactorRecord: WorksheetRowDTO;
        const riskFactorGridInfo = new GridInfo<WorksheetRowDTO>();
        riskFactorGridInfo.Records = [];
        insured.Coverages_LazyLoad.forEach(coverage => {
            coverage.WorksheetRows_LazyLoad.forEach(worksheetRow => {
                if (!this.isCANCADAORecord(worksheetRow)) {
                    if (sourceType === RiskFactorSourceType.SYSTEM_GENERATED) {
                        riskFactorRecord = this.getSystemGeneratedRiskFactorRecords(worksheetRow);
                    } else if (sourceType === RiskFactorSourceType.USER_GENERATED) {
                        riskFactorRecord = this.getUserGeneratedRiskFactorRecords(worksheetRow);
                    } else {
                        riskFactorRecord = worksheetRow;
                    }
                    if (riskFactorRecord) {
                        riskFactorGridInfo.Records.push(worksheetRow);
                        riskFactorGridInfo.Total += worksheetRow.Debit ? ConvertUtil.toNumber(worksheetRow.Debit) : 0;
                    }
                }
            });
        });

        return riskFactorGridInfo;
    }

    public getMedicationGridInfo(insured: InsuredDTO, sourceType?: number): GridInfo<MedicationDTO> {
        let medicationRecord: MedicationDTO;
        const medicationGridInfo = new GridInfo<MedicationDTO>();
        insured.Medication_LazyLoad.forEach(medication => {
            if (sourceType === RiskFactorSourceType.SYSTEM_GENERATED) {
                medicationRecord = this.getSystemGeneratedMedicationRecords(medication);
            } else if (sourceType === RiskFactorSourceType.USER_GENERATED) {
                medicationRecord = this.getUserGeneratedMedicationRecords(medication);
            } else {
                medicationRecord = medication;
            }
            if (medicationRecord) {
                medicationGridInfo.Records.push(medicationRecord);
                medicationGridInfo.Total += medicationRecord.Points ? ConvertUtil.toNumber(medicationRecord.Points) : 0;
            }
        });
        return medicationGridInfo;
    }

    public getMedicalConditionGridInfo(insured: InsuredDTO, sourceType?: number): GridInfo<MedicalConditionDTO> {
        let medicalConditionRecord: MedicalConditionDTO;
        const medicalConditionGridInfo = new GridInfo<MedicalConditionDTO>();
        insured.MedicalConditions_LazyLoad.forEach(medicalCondition => {
            if (sourceType === RiskFactorSourceType.SYSTEM_GENERATED) {
                medicalConditionRecord = this.getSystemGeneratedMedicalConditionRecords(medicalCondition);
            } else if (sourceType === RiskFactorSourceType.USER_GENERATED) {
                medicalConditionRecord = this.getUserGeneratedMedicalConditionRecords(medicalCondition);
            } else {
                medicalConditionRecord = medicalCondition;
            }
            if (medicalConditionRecord) {
                medicalConditionGridInfo.Records.push(medicalConditionRecord);
                medicalConditionGridInfo.Total += medicalConditionRecord.Points
                    ? ConvertUtil.toNumber(medicalConditionRecord.Points)
                    : 0;
            }
        });
        return medicalConditionGridInfo;
    }

    public getCoronaryTestGridInfo(insured: InsuredDTO): GridInfo<any> {
        const coronaryGridInfo = new GridInfo<any>();
        let CANPoints, CADPoints, AOPoints: number;
        insured.Coverages_LazyLoad.forEach(coverage => {
            coverage.WorksheetRows_LazyLoad.forEach(worksheetRow => {
                const debit = worksheetRow.Debit ? ConvertUtil.toNumber(worksheetRow.Debit) : 0;
                if (this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.CAN)) {
                    CANPoints += debit;
                    coronaryGridInfo.Total += debit;
                } else if (this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.CAD)) {
                    CADPoints += debit;
                    coronaryGridInfo.Total += debit;
                } else if (this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.AO)) {
                    AOPoints += debit;
                    coronaryGridInfo.Total += debit;
                }
            });
        });
        if (CANPoints || CADPoints || AOPoints) {
            coronaryGridInfo.Records.push({
                CAN: CANPoints,
                CAD: CADPoints,
                AO: AOPoints
            });
        }
        return coronaryGridInfo;
    }

    private getMedicalConditionsPoints(insured: InsuredDTO): number {
        return insured.MedicalConditions_LazyLoad.reduce(this.getTotalPointsPredicate, 0);
    }

    private getMedicationPoints(insured: InsuredDTO): number {
        return insured.Medication_LazyLoad.reduce(this.getTotalPointsPredicate, 0);
    }

    private getUserGeneratedRiskFactorRecords(worksheetRow: WorksheetRowDTO): WorksheetRowDTO {
        return !this.isSystemGeneratedRiskFactor(worksheetRow) ? worksheetRow : null;
    }

    private getSystemGeneratedRiskFactorRecords(worksheetRow: WorksheetRowDTO): WorksheetRowDTO {
        return this.isSystemGeneratedRiskFactor(worksheetRow) ? worksheetRow : null;
    }

    private isSystemGeneratedRiskFactor(worksheetRow: WorksheetRowDTO): boolean {
        return !!worksheetRow.OriginCode;
    }

    private isCANCADAORecord(worksheetRow: WorksheetRowDTO): boolean {
        return (
            this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.CAN) ||
            this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.CAD) ||
            this.isRecordTypeExist(worksheetRow, RiskFactorSystemGeneratedTypes.AO)
        );
    }

    private getUserGeneratedMedicationRecords(medication: MedicationDTO): MedicationDTO {
        return !this.isSystemGeneratedMedication(medication) ? medication : null;
    }

    private getSystemGeneratedMedicationRecords(medication: MedicationDTO): MedicationDTO {
        return this.isSystemGeneratedMedication(medication) ? medication : null;
    }

    private isSystemGeneratedMedication(medication: MedicationDTO): boolean {
        return medication.IsSystemGenerated === 'true';
    }

    private getUserGeneratedMedicalConditionRecords(medicalCondition: MedicalConditionDTO): MedicalConditionDTO {
        return !this.isSystemGeneratedMedicalCondition(medicalCondition) ? medicalCondition : null;
    }

    private getSystemGeneratedMedicalConditionRecords(medicalCondition: MedicalConditionDTO): MedicalConditionDTO {
        return this.isSystemGeneratedMedicalCondition(medicalCondition) ? medicalCondition : null;
    }

    private isSystemGeneratedMedicalCondition(medicalCondition: MedicalConditionDTO): boolean {
        return medicalCondition.IsSystemGenerated === 'true';
    }

    private isRecordTypeExist(worksheetRow: WorksheetRowDTO, recordType: string): boolean {
        return (
            worksheetRow.OriginCode === Origin.FROM_POINTSCALC &&
            worksheetRow.RiskFactor.toUpperCase().indexOf(recordType) !== -1
        );
    }

    private getTotalPointsPredicate(accumulator: number, currentValue: MedicalConditionDTO | MedicationDTO): number {
        return accumulator + (currentValue.Points ? ConvertUtil.toNumber(currentValue.Points) : 0);
    }

    private getTotalDebitsPredicate(accumulator: number, currentValue: WorksheetRowDTO): number {
        return accumulator + (currentValue.Debit ? ConvertUtil.toNumber(currentValue.Debit) : 0);
    }

    private getFilteredWorksheetRows(worksheetRows: WorksheetRowDTO[], userGeneratedRows: boolean): WorksheetRowDTO[] {
        return userGeneratedRows
            ? worksheetRows.filter(
                  worksheetRow => !worksheetRow.OriginCode || (!worksheetRow.OriginCode.trim() && worksheetRow.Debit)
              )
            : worksheetRows.filter(worksheetRow => worksheetRow.Debit);
    }
}
