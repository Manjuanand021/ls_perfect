import { Injectable } from '@angular/core';

import { NamePattern } from 'life-core/util';
import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

import { BeneficiaryUtil } from './beneficiary.util';

const BeneficiaryFields = {
    FirstName: 'FirstName',
    PersonTypeId: 'PersonTypeId',
    BirthDate: 'BirthDate',
    BenefitType: 'BenefitType',
    RelationshipToInsuredCode: 'RelationshipToInsuredCode',
    TaxId: 'TaxId',
    Amount: 'Amount',
    Percentage: 'Percentage',
    BeneficiaryType: 'RoleId',
    IrrevokableIndicator: 'IrrevokableIndicator'
};

@Injectable()
export class BeneficiaryGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _cellFormatters: CellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(
        lsCellFormatters: LsCellFormatters,
        cellFormatters: CellFormatters,
        lsCellComparators: LsCellComparators,
        i18n: I18n
    ) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._cellFormatters = cellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'applicant.coverage.beneficiary.beneficiary' }),
            field: BeneficiaryFields.FirstName,
            width: 100,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.NameWithTitleSuffixAndMiddleInitial),
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Party Type', id: 'applicant.coverage.beneficiary.partytype' }),
            field: BeneficiaryFields.PersonTypeId,
            width: 100,
            valueFormatter: this.getPartyTypeLabel
        });
        this.addColumn({
            headerName: this.i18n({ value: 'DOB/DOT', id: 'applicant.coverage.beneficiary.birthdate' }),
            field: BeneficiaryFields.BirthDate,
            width: 200,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Benefit Type', id: 'applicant.coverage.beneficiary.benefittype' }),
            field: BeneficiaryFields.BenefitType,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Relation', id: 'applicant.coverage.beneficiary.relation' }),
            field: BeneficiaryFields.RelationshipToInsuredCode,
            width: 100,
            valueFormatter: this.getRelationLabel,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Tax ID', id: 'applicant.coverage.beneficiary.taxid' }),
            field: BeneficiaryFields.TaxId,
            width: 150,
            valueFormatter: this._lsCellFormatters.taxIdFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Amount', id: 'applicant.coverage.beneficiary.amount' }),
            field: BeneficiaryFields.Amount,
            width: 100,
            valueFormatter: this._cellFormatters.currencyCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Share %', id: 'applicant.coverage.beneficiary.sharepercentwithspace' }),
            field: BeneficiaryFields.Percentage,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'P/C', id: 'applicant.coverage.beneficiary.beneficiarytype' }),
            field: BeneficiaryFields.BeneficiaryType,
            width: 100,
            valueFormatter: this.getBeneficiaryTypeLabel
        });
        this.addColumn({
            headerName: this.i18n({ value: 'R/I', id: 'applicant.coverage.beneficiary.irrevocable' }),
            field: BeneficiaryFields.IrrevokableIndicator,
            width: 100,
            valueFormatter: this.getIrrevocableLabel
        });
        return this.columns;
    }

    private getPartyTypeLabel(params: any): string {
        if (params.node.data.PersonTypeId) {
            return BeneficiaryUtil.convertToDropdownListAndGetLabel(
                params.context.listData.PersonTypeId,
                params.node.data.PersonTypeId
            );
        }
        return '';
    }

    private getRelationLabel(params: any): string {
        if (params.node.data.RelationshipToInsuredCode) {
            return BeneficiaryUtil.convertToDropdownListAndGetLabel(
                params.context.listData.RelationshipToInsuredCode,
                params.node.data.RelationshipToInsuredCode
            );
        }
        return '';
    }

    private getBeneficiaryTypeLabel(params: any): string {
        if (params.node.data.RoleId) {
            return BeneficiaryUtil.getLabelFromExternalCode(
                params.context.listData.BeneficiaryType,
                params.node.data.RoleId
            );
        }
        return '';
    }

    private getIrrevocableLabel(params: any): string {
        return params.node.data.IrrevokableIndicator == '-1' ? 'Irrevocable' : 'Revocable';
    }
}
