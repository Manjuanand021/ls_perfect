import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { MetadataUtil } from 'ls-core/util';

@Injectable()
export class OtherRisksGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(i18n: I18n, cellFormatters: CellFormatters) {
        super();
        this.i18n = i18n;
        this._cellFormatters = cellFormatters;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Risk Factor', id: 'policy.worksheet.debitcredit.gridheader.riskfactor' }),
            field: OtherRisksGridFields.RiskFactor,
            width: 100,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Description', id: 'policy.worksheet.debitcredit.gridheader.description' }),
            field: OtherRisksGridFields.Note,
            width: 200,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.worksheet.debitcredit.gridheader.debitcredit' }),
            field: OtherRisksGridFields.Debit,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.worksheet.debitcredit.gridheader.createdby' }),
            field: OtherRisksGridFields.AddedBy,
            width: 100,
            valueFormatter: this.getUserName
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.node.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.node.data.AddedBy);
        }
    }
}

export const OtherRisksGridFields = {
    RiskFactor: 'RiskFactor',
    Note: 'Note',
    Debit: 'Debit',
    AddedBy: 'AddedBy'
};
