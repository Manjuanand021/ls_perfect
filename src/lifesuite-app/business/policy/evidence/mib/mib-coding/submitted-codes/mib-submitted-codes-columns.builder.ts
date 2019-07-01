import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { LsCellFormatters } from 'ls-core/component/grid';
import { MetadataUtil } from 'ls-core/util';
import { MetadataItem } from 'ls-core/model';
import { I18n } from 'life-core/i18n';

const MIBSubmittedCodesFields = {
    MibCodes: 'MibCodes',
    EffectiveDate: 'EffectiveDate',
    AddedBy: 'AddedBy',
    DateAdded: 'DateAdded',
    DateSent: 'DateSent'
};

@Injectable()
export class MIBSubmittedCodesColumnsBuilder extends BaseGridColumnsBuilder {
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
        const filterButtonParams: any = { applyButton: true, clearButton: true };
        this.addColumn({
            headerName: this.i18n({ value: 'MIB Code', id: 'policy.mib.submitted.codes.gridheader.mibcode' }),
            filter: 'text',
            field: MIBSubmittedCodesFields.MibCodes,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Effective Date',
                id: 'policy.mib.submitted.codes.gridheader.effectivedate'
            }),
            field: MIBSubmittedCodesFields.EffectiveDate,
            filter: 'text',
            filterParams: filterButtonParams,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.mib.submitted.codes.gridheader.createdby' }),
            field: MIBSubmittedCodesFields.AddedBy,
            filter: 'text',
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.mib.submitted.codes.gridheader.createdon' }),
            field: MIBSubmittedCodesFields.DateAdded,
            filter: 'text',
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Date Sent', id: 'policy.mib.submitted.codes.gridheader.datesent' }),
            field: MIBSubmittedCodesFields.DateSent,
            filter: 'text',
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
    }

    private getUserName(params: any): string {
        if (params.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.data.AddedBy as string);
        }
        return '';
    }
}
