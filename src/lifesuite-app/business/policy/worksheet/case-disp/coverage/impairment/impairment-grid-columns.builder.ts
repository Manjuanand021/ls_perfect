import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class ImpairmentGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Code', id: 'policy.worksheet.coverage.impairment.issueCode' }),
            field: ImpairmentGridFields.ImpairmentRestrictionCode,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Description', id: 'policy.worksheet.coverage.amendment.restrictionText' }),
            field: ImpairmentGridFields.ImpairmentText,
            width: 600,
            autoHeight: true
        });
        return this.columns;
    }
}

export const ImpairmentGridFields = {
    ImpairmentRestrictionCode: 'ImpairmentRestrictionCode',
    ImpairmentText: 'ImpairmentText'
};
