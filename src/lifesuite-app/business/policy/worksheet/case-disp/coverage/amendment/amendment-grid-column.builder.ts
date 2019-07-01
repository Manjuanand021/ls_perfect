import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class AmendmentGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        let amendmentGridFieldsIntlMap: { [reinsurerGridField: string]: string } = {
            [AmendmentFields.AmendmentType]: this.i18n({
                value: 'Issue Request Type',
                id: 'policy.worksheet.coverage.amendment.issueType'
            }),
            [AmendmentFields.AmendmentCode]: this.i18n({
                value: 'Code',
                id: 'policy.worksheet.coverage.amendment.issuecode'
            }),
            [AmendmentFields.AmendmentText]: this.i18n({
                value: 'Description',
                id: 'policy.worksheet.coverage.amendment.restrictionText'
            })
        };
        this.addColumn({
            headerName: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentType],
            field: AmendmentFields.AmendmentType,
            width: 200,
            headerTooltip: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentType]
        });
        this.addColumn({
            headerName: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentCode],
            field: AmendmentFields.AmendmentCode,
            width: 200,
            headerTooltip: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentCode]
        });
        this.addColumn({
            headerName: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentText],
            field: AmendmentFields.AmendmentText,
            width: 400,
            autoHeight: true,
            headerTooltip: amendmentGridFieldsIntlMap[AmendmentFields.AmendmentText]
        });
        return this.columns;
    }
}

export const AmendmentFields = {
    AmendmentType: 'AmendmentType',
    AmendmentCode: 'AmendmentCode',
    AmendmentText: 'AmendmentText'
};
