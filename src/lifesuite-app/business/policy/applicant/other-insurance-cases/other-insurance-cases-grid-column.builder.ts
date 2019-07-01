import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { ListItem } from 'life-core/model';
import { ListUtil } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class OtherInsuranceCasesGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(
        cellFormatters: CellFormatters,
        lsCellFormatters: LsCellFormatters,
        lsCellComparators: LsCellComparators,
        i18n: I18n
    ) {
        super();
        this._cellFormatters = cellFormatters;
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Company Name', id: 'policy.applicant.otherInsurancePolicies.companyname' }),
            field: OtherInsuranceCasesFields.Company,
            width: 100,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'policy.applicant.otherInsurancePolicies.status' }),
            field: OtherInsuranceCasesFields.Status,
            width: 80,
            valueFormatter: this.getStatus
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Replacement Type',
                id: 'policy.applicant.otherInsurancePolicies.replacementtype'
            }),
            field: OtherInsuranceCasesFields.ReplacementType,
            width: 100,
            valueFormatter: this.getReplacementType
        });
        this.addColumn({
            headerName: this.i18n({ value: 'LOB', id: 'policy.applicant.otherInsurancePolicies.lob' }),
            field: OtherInsuranceCasesFields.LineOfBusiness,
            width: 60,
            valueFormatter: this.getLineOfBusinessLabel
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Purpose', id: 'policy.applicant.otherInsurancePolicies.purpose' }),
            field: OtherInsuranceCasesFields.PurposeOfCoverage,
            width: 90
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Policy #', id: 'policy.applicant.otherInsurancePolicies.policynbr' }),
            field: OtherInsuranceCasesFields.PolicyNumber,
            width: 90,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Date Issued', id: 'policy.applicant.otherInsurancePolicies.dateissued' }),
            field: OtherInsuranceCasesFields.IssueDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Amount', id: 'policy.applicant.otherInsurancePolicies.amount' }),
            field: OtherInsuranceCasesFields.Amount,
            valueFormatter: this._cellFormatters.currencyCellFormatter,
            width: 90
        });
        this.addColumn({
            headerName: this.i18n({ value: 'ADB', id: 'policy.applicant.otherInsurancePolicies.adb' }),
            field: OtherInsuranceCasesFields.AdbAmount,
            valueFormatter: this._cellFormatters.currencyCellFormatter,
            width: 90
        });
        return this.columns;
    }

    private getStatus(params: any): string {
        if (params.node.data.Status) {
            const statusDropdownList: ListItem[] = ListUtil.convertToListItems(params.context.listData.Status);
            return ListUtil.getLabelByValue(statusDropdownList, params.node.data.Status);
        }
        return '';
    }

    private getReplacementType(params: any): string {
        if (params.node.data.ReplacementType) {
            const replacementTypeDropdownList: ListItem[] = ListUtil.convertToListItems(
                params.context.listData.ReplacementType
            );
            return ListUtil.getLabelByValue(replacementTypeDropdownList, params.node.data.ReplacementType);
        }
        return '';
    }

    private getLineOfBusinessLabel(params: any): string {
        if (params.node.data.LineOfBusiness) {
            const lineOfBusinessDropdownList: ListItem[] = ListUtil.convertToListItems(
                params.context.listData.LineOfBusiness
            );
            return ListUtil.getLabelByValue(lineOfBusinessDropdownList, params.node.data.LineOfBusiness);
        }
        return '';
    }
}

export const OtherInsuranceCasesFields = {
    Company: 'Company',
    Status: 'Status',
    ReplacementType: 'ReplacementType',
    LineOfBusiness: 'LineOfBusiness',
    PurposeOfCoverage: 'PurposeOfCoverage',
    PolicyNumber: 'PolicyNumber',
    IssueDate: 'IssueDate',
    Amount: 'Amount',
    AdbAmount: 'AdbAmount'
};
