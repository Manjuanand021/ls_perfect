import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class LabCommentDetailGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Remark', id: 'policy.lab.detail.remark.gridheader.remark' }),
            field: LabCommentGridFields.RemarkId,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Comment', id: 'policy.lab.detail.remark.gridheader.comment' }),
            field: LabCommentGridFields.CommentText,
            width: 80
        });
        return this.columns;
    }
}

const LabCommentGridFields = {
    RemarkId: 'RemarkId',
    CommentText: 'CommentText'
};
