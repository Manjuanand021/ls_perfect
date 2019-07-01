import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { NamePattern } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class MVRGridColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Date', id: 'policy.mvr.gridheader.data' }),
            field: MVRGridFields.ReportDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'License Name', id: 'policy.mvr.gridheader.licensename' }),
            field: MVRGridFields.FullName,
            width: 100,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.LastFirstAndMiddleInitial)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'State', id: 'policy.mvr.gridheader.state' }),
            field: MVRGridFields.State,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'License Number', id: 'policy.mvr.gridheader.licensenumber' }),
            field: MVRGridFields.LicenseNumber,
            width: 200
        });
        return this.columns;
    }
}

const MVRGridFields = {
    ReportDate: 'ReportDate',
    FullName: 'FullName',
    State: 'State',
    LicenseNumber: 'LicenseNumber'
};
