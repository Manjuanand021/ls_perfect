import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class RecentlyAccessedCasesGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getRecentlyAccessedCasesGridColumns();
        return this.columns;
    }

    private getRecentlyAccessedCasesGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'summary.recentcases.gridheader.policynumber' }),
            field: RecentlyAccessedCasesGridFields.PolicyNumber,
            suppressFilter: true,
            suppressSorting: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'summary.recentcases.gridheader.insuredname' }),
            field: RecentlyAccessedCasesGridFields.InsuredNameFull,
            suppressFilter: true,
            suppressSorting: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'summary.recentcases.gridheader.policystatuscode' }),
            field: RecentlyAccessedCasesGridFields.Status,
            suppressFilter: true,
            suppressSorting: true
        });
    }
}

const RecentlyAccessedCasesGridFields = {
    PolicyNumber: 'PolicyNumber',
    InsuredNameFull: 'InsuredNameFull',
    Status: 'ApplicantStatus'
};
