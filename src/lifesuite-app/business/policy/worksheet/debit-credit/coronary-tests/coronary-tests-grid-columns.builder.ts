import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { RiskFactorSystemGeneratedTypes } from '../';

@Injectable()
export class CoronaryTestsColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'CAN', id: 'policy.worksheet.debitcredit.gridheader.can' }),
            field: RiskFactorSystemGeneratedTypes.CAN,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'CAD', id: 'policy.worksheet.debitcredit.gridheader.cad' }),
            field: RiskFactorSystemGeneratedTypes.CAD,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'AO', id: 'policy.worksheet.debitcredit.gridheader.ao' }),
            field: RiskFactorSystemGeneratedTypes.AO,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 200
        });
        return this.columns;
    }
}
