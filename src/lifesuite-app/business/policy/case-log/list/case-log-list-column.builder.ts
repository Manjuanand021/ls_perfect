import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';

import { LsCellFormatters } from 'ls-core/component/grid';
import { MetadataItem } from 'ls-core/model/metadata/metadata.model';
import { DateTimeFormatWidth } from 'life-core/util';
import { MetadataUtil } from 'ls-core/util/metadata';

const LogEntryFields = {
    LogDate: 'LogDate',
    LogText: 'LogText',
    UserId: 'UserId'
};

@Injectable()
export class CaseLogListColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;

    constructor(lsCellFormatters: LsCellFormatters, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Date & Time', id: 'policy.case.log.date' }),
            field: LogEntryFields.LogDate,
            width: 40,
            valueFormatter: params =>
                this._lsCellFormatters.dateCellFormatter(params, DateTimeFormatWidth.ShortDateMediumTime)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'User ID', id: 'policy.case.log.status' }),
            field: LogEntryFields.UserId,
            width: 40,
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status Text', id: 'policy.case.log.userID' }),
            field: LogEntryFields.LogText,
            width: 100,
            autoHeight: true,
            tooltipField: LogEntryFields.LogText
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.node.data && params.node.data.UserId) {
            return MetadataUtil.getItemLabelByCode(
                params.context.hostComponent.context.metaData.aus_users,
                params.node.data.UserId
            );
        }
    }
}
