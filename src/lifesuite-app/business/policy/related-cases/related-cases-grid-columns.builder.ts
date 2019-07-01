import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

const RelatedCasesGridFields = {
    PolicyNumber: 'PolicyNumber',
    InsuredNameFull: 'InsuredNameFull',
    PrimaryPlanCode: 'PrimaryPlanCode',
    RelationshipToInsured: 'RelationshipToInsured',
    ApplicantStatusShort: 'ApplicantStatusShort',
    AdverseHistory: 'AdverseHistory'
};

@Injectable()
export class RelatedCasesGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Cases', id: 'policy.relatedcases.gridheader.policynumber' }),
            field: RelatedCasesGridFields.PolicyNumber,
            width: 120
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'policy.relatedcases.gridheader.insuredname' }),
            field: RelatedCasesGridFields.InsuredNameFull,
            width: 140
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Plan Code', id: 'policy.relatedcases.gridheader.plancode' }),
            field: RelatedCasesGridFields.PrimaryPlanCode,
            width: 120
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Relationship', id: 'policy.relatedcases.gridheader.relationship' }),
            field: RelatedCasesGridFields.RelationshipToInsured,
            width: 120
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'policy.relatedcases.gridheader.policystatuscode' }),
            field: RelatedCasesGridFields.ApplicantStatusShort,
            width: 120
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Adverse History', id: 'policy.relatedcases.gridheader.adversehistory' }),
            field: RelatedCasesGridFields.AdverseHistory,
            width: 120
        });

        return this.columns;
    }
}
