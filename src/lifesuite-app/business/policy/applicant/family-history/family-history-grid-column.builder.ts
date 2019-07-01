import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { ListDataUtil } from 'ls-core/service/list-data';

@Injectable()
export class FamilyHistoryGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Relationship', id: 'applicant.info.family.relationship' }),
            field: FamilyHistoryFields.FamhistRelationshipCode,
            valueFormatter: this.getRelationship,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'applicant.info.family.status' }),
            field: FamilyHistoryFields.LivingStatus,
            valueFormatter: this.getStatus,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Age', id: 'applicant.info.family.age' }),
            field: FamilyHistoryFields.Age,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Cancer Age', id: 'applicant.info.family.cancerage' }),
            field: FamilyHistoryFields.CancerAge,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Heart Age', id: 'applicant.info.family.heartage' }),
            field: FamilyHistoryFields.HeartAge,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Other Age', id: 'applicant.info.family.otherage' }),
            field: FamilyHistoryFields.OtherAge,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Reason', id: 'applicant.info.family.reason' }),
            field: FamilyHistoryFields.Description,
            width: 100,
            autoHeight: true
        });
        return this.columns;
    }

    private getRelationship(params: any): string {
        return ListDataUtil.getValueFromListDataById(
            params.context.listData.FamhistRelationshipCode,
            params.node.data.FamhistRelationshipCode
        );
    }

    private getStatus(params: any): string {
        return ListDataUtil.getValueFromListDataById(
            params.context.listData.LivingStatus,
            params.node.data.LivingStatus
        );
    }
}

export const FamilyHistoryFields = {
    FamhistRelationshipCode: 'FamhistRelationshipCode',
    LivingStatus: 'LivingStatus',
    Age: 'Age',
    CancerAge: 'CancerAge',
    HeartAge: 'HeartDiseaseAge',
    OtherAge: 'OtherDiseaseAge',
    Description: 'Description'
};
