import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

const RxUsageFields = {
    MibCodes: 'MibCodes', //
    DateAdded: 'DateAdded' //
};

@Injectable()
export class RxUsageColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'MIB Code', id: 'policy.mib.submitted.codes.gridheader.mibcode' }),
            field: RxUsageFields.MibCodes,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.mib.submitted.codes.gridheader.createdon' }),
            field: RxUsageFields.DateAdded,
            width: 70,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        return this.columns;
    }
}
