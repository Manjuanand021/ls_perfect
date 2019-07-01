import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class ApplicantActionGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Actions', id: 'policy.applicant.info.applicantactions' }),
            field: ApplicantActions.Action,
            width: 40
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Count', id: 'policy.applicant.info.applicantcount' }),
            field: ApplicantActions.Count,
            width: 40
        });
        return this.columns;
    }
}

export const ApplicantActions = {
    Action: 'Action',
    Count: 'Count'
};
