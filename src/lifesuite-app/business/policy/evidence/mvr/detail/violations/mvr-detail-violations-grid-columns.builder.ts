import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class MVRDetailViolationsGridColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Violation Type', id: 'policy.mvr.detail.gridheader.violationtype' }),
            field: MVRDetailFields.ViolationType,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Violation Date', id: 'policy.mvr.detail.gridheader.violationdate' }),
            field: MVRDetailFields.ViolationDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Conviction Date', id: 'policy.mvr.detail.gridheader.convictiondate' }),
            field: MVRDetailFields.ConvictionDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Violation Code', id: 'policy.mvr.detail.gridheader.violationcode' }),
            field: MVRDetailFields.ViolationCode,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Points', id: 'policy.mvr.detail.gridheader.points' }),
            field: MVRDetailFields.Points,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Assigned Violation Code',
                id: 'policy.mvr.detail.gridheader.assignedviolationcode'
            }),
            field: MVRDetailFields.AssignedViolationCode,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Assigned Points', id: 'policy.mvr.detail.gridheader.assignedpoints' }),
            field: MVRDetailFields.AssignedPoints,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Details', id: 'policy.mvr.detail.gridheader.violationdetail' }),
            field: MVRDetailFields.ViolationDetail,
            width: 100,
            autoHeight: true
        });
        return this.columns;
    }
}

const MVRDetailFields = {
    ViolationType: 'ViolationType',
    ViolationDate: 'ViolationDate',
    ConvictionDate: 'ConvictionDate',
    ViolationCode: 'ViolationCode',
    Points: 'Points',
    AssignedViolationCode: 'AssignedViolationCode',
    AssignedPoints: 'AssignedPoints',
    ViolationDetail: 'ViolationDetail'
};
