import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { MetadataItem } from 'ls-core/model';
import { MetadataUtil } from 'ls-core/util';
import { DateTimeFormatWidth } from 'life-core/util';

@Injectable()
export class EvidenceStatusListGridColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Date and Time', id: 'policy.requirement.history.gridheader.dateTime' }),
            field: EvidenceStatusListFields.StatusDate,
            width: 40,
            valueFormatter: param =>
                this._lsCellFormatters.dateCellFormatter(param, DateTimeFormatWidth.ShortDateMediumTime),
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Source', id: 'policy.requirement.history.gridheader.source' }),
            field: EvidenceStatusListFields.AddedBy,
            width: 40,
            filter: 'text',
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Vendor Status Code',
                id: 'policy.requirement.history.gridheader.statusCode'
            }),
            field: EvidenceStatusListFields.StatusId,
            width: 30
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Follow-up Date',
                id: 'policy.requirement.history.gridheader.followupDate'
            }),
            field: EvidenceStatusListFields.FollowupDate,
            width: 40,
            valueFormatter: param =>
                this._lsCellFormatters.dateCellFormatter(param, DateTimeFormatWidth.ShortDateMediumTime),
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status Text', id: 'policy.requirement.history.gridheader.statusText' }),
            field: EvidenceStatusListFields.MessageText,
            width: 70,
            // TODO: use after ag-grid v18 upgrade
            autoHeight: true
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.ausUsers, params.data.AddedBy as string);
        }
        return '';
    }
}

const EvidenceStatusListFields = {
    StatusDate: 'StatusDate',
    AddedBy: 'AddedBy',
    StatusId: 'StatusId',
    FollowupDate: 'FollowupDate',
    MessageText: 'MessageText'
};
