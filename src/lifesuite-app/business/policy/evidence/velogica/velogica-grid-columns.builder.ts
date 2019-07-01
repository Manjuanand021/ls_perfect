import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

const VelogicaGridFields = {
    StatusDate: 'StatusDate',
    StatusResponse: 'StatusResponse',
    Decision: 'Decision'
};

@Injectable()
export class VelogicaGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Status Date', id: 'policy.velogica.gridheader.date' }),
            field: VelogicaGridFields.StatusDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'policy.velogica.gridheader.status' }),
            field: VelogicaGridFields.StatusResponse,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Decision', id: 'policy.velogica.gridheader.decision' }),
            field: VelogicaGridFields.Decision,
            width: 200
        });
        return this.columns;
    }
}
