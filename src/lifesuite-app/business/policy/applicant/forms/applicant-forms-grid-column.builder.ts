import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

const FormsFields = {
    Label: 'Label',
    QuestionText: 'QuestionText',
    Answer: 'Answer',
    Comment: 'Comment'
};

@Injectable()
export class ApplicantFormsGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: '',
            field: '',
            width: 100,
            valueFormatter: this.getSequenceNumber
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Label', id: 'policy.applicant.form.question.label' }),
            field: FormsFields.Label,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Question', id: 'policy.applicant.form.question.question' }),
            field: FormsFields.QuestionText,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Answer', id: 'policy.applicant.form.question.answer' }),
            field: FormsFields.Answer,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Comments', id: 'policy.applicant.form.question.comments' }),
            field: FormsFields.Comment,
            width: 100
        });
        return this.columns;
    }

    private getSequenceNumber(params: any): string {
        return params.node.rowIndex + 1;
    }
}
