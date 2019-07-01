import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class CaseTemplateListColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;

        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getReassignCaseGridColumns();
        return this.columns;
    }

    private getReassignCaseGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'policy.documents.attachments.grid.name' }),
            field: CaseTemplateListFields.FileName,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.documents.attachments.grid.createdon' }),
            field: CaseTemplateListFields.CreateDate,
            width: 20,
            valueFormatter: params => this._lsCellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Last Modified On',
                id: 'policy.documents.attachments.grid.lastmodifiedon'
            }),
            field: CaseTemplateListFields.LastModifiedDate,
            width: 20,
            valueFormatter: params => this._lsCellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator
        });
    }
}

const CaseTemplateListFields = {
    FileName: 'FileName',
    CreateDate: 'CreateDate',
    LastModifiedDate: 'LastModifiedDate'
};
