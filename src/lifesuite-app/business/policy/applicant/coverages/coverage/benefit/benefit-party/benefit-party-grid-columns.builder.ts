import { Injectable } from '@angular/core';

import { MeasurementUtil, ListUtil, NamePattern } from 'life-core/util';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { ListItem } from 'life-core/model';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class BenefitPartyGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(...params: any[]): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'applicant.coverage.benefit.benefitparty.name' }),
            field: BenefitPartyGridFields.FullName,
            width: 100,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.LastFirstAndMiddleInitial),
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'DOB', id: 'applicant.coverage.benefit.benefitparty.dob' }),
            field: BenefitPartyGridFields.BirthDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Gender', id: 'applicant.coverage.benefit.benefitparty.gender' }),
            field: BenefitPartyGridFields.Gender,
            width: 100,
            valueFormatter: this.getGender
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Height', id: 'applicant.coverage.benefit.benefitparty.height' }),
            field: BenefitPartyGridFields.Height,
            width: 100,
            valueFormatter: this.getHeight
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Weight', id: 'applicant.coverage.benefit.benefitparty.weight' }),
            field: BenefitPartyGridFields.Weight,
            width: 100,
            valueFormatter: this.getWeight
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Relation', id: 'applicant.coverage.benefit.benefitparty.relation' }),
            field: BenefitPartyGridFields.Relation,
            width: 100,
            valueFormatter: this.getRelation,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Client ID', id: 'applicant.coverage.benefit.benefitparty.clientid' }),
            field: BenefitPartyGridFields.ClientId,
            width: 100
        });
        return this.columns;
    }

    private getGender(params: any): string {
        if (params.value) {
            return params.value === 'M' ? 'Male' : 'Female';
        }
    }
    private getHeight(params: any): string {
        if (params.value) {
            return `${MeasurementUtil.getFtFromHeight(params.value)} ft ${MeasurementUtil.getInchFromHeight(
                params.value
            )} in / ${MeasurementUtil.convertInchToCm(params.value)} cm`;
        }
    }

    private getWeight(params: any): string {
        if (params.value) {
            return `${params.value} lb / ${MeasurementUtil.convertLbToKg(params.value)} kg`;
        }
    }

    private getRelation(params: any): string {
        if (params.node.data.RelationshipToInsuredCode) {
            const RelationShipToInsuredDropDownList: ListItem[] = ListUtil.convertToListItems(
                params.context.listData.RelationshipToInsuredCode
            );
            return ListUtil.getLabelByValue(
                RelationShipToInsuredDropDownList,
                params.node.data.RelationshipToInsuredCode
            );
        }
        return '';
    }
}

export const BenefitPartyGridFields = {
    FullName: 'FirstName',
    BirthDate: 'BirthDate',
    Gender: 'Sex',
    Height: 'HeightInches',
    Weight: 'WeightPounds',
    Relation: 'RelationshipToInsuredCode',
    ClientId: 'ClientId'
};
