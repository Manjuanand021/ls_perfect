import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class RiskFactorColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Test Name', id: 'policy.worksheet.debitcredit.gridheader.​testname' }),
            field: RiskFactorFields.TestName,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Result', id: 'policy.worksheet.debitcredit.gridheader.​Result' }),
            field: RiskFactorFields.Result,
            width: 120
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Range', id: 'policy.worksheet.debitcredit.gridheader.​range' }),
            field: RiskFactorFields.Range,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Rate Class', id: 'policy.worksheet.debitcredit.rateclass.rateclass' }),
            field: RiskFactorFields.RateClassDesc,
            width: 150
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Debit/Credit',
                id: 'policy.worksheet.debitcredit.gridheader.​debitcredit'
            }),
            field: RiskFactorFields.DebitCredit,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 80
        });
        return this.columns;
    }
}

export const RiskFactorFields = {
    TestName: 'RiskFactor', //
    Result: 'Result',
    Range: 'Note',
    RateClassDesc: 'RateClassDesc',
    DebitCredit: 'Debit'
};
