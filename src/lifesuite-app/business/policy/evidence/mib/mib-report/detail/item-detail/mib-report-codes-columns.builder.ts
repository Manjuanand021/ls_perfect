import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters } from 'ls-core/component/grid';

const MIBReportCodesFields = {
    DataItem: 'DataItem',
    FieldId: 'FieldId',
    ReportedBy: 'ReportedBy',
    DateReported: 'DateReported'
};

@Injectable()
export class MIBReportCodeColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;

    constructor(lsCellFormatters: LsCellFormatters, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getMIBReportCodesGridColumns();
        return this.columns;
    }

    private getMIBReportCodesGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Data Item', id: 'policy.mib.detail.gridheader.dataitem' }),
            field: MIBReportCodesFields.DataItem
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Carrier Code', id: 'policy.mib.detail.gridheader.carrier' }),
            field: MIBReportCodesFields.ReportedBy
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Submit Date', id: 'policy.mib.detail.gridheader.datsubmitdateaitem' }),
            field: MIBReportCodesFields.DateReported,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Field ID', id: 'policy.mib.detail.gridheader.fieldid' }),
            field: MIBReportCodesFields.FieldId
        });
    }
}
