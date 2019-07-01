import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { NamePattern } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class LabGridColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Received Date', id: 'policy.lab.gridheader.receivedate' }),
            field: LabGridFields.DrawnDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Lab', id: 'policy.lab.gridheader.lab' }),
            field: LabGridFields.LabIdNumber,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Lab ID', id: 'policy.lab.gridheader.labid' }),
            field: LabGridFields.LabTypeId,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'policy.lab.gridheader.name' }),
            field: LabGridFields.FullName,
            width: 80,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.LastAndFirstName)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'SSN', id: 'policy.lab.gridheader.ssn' }),
            field: LabGridFields.Ssn,
            valueFormatter: this._lsCellFormatters.taxIdFormatter,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Comment', id: 'policy.lab.gridheader.comment' }),
            field: LabGridFields.Comment,
            width: 80
        });
        return this.columns;
    }
}

const LabGridFields = {
    DrawnDate: 'DrawnDate',
    LabIdNumber: 'LabIdNumber',
    LabTypeId: 'LabTypeId',
    FullName: 'FullName',
    Ssn: 'Ssn',
    Comment: 'Comment'
};
