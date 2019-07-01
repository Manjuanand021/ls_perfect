import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class CheckableMessagesColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getCheckableMessagesGridColumns();
        return this.columns;
    }

    private getCheckableMessagesGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Message', id: 'policy.worksheet.reviewmsg.gridheader.message' }),
            field: CheckableMessageGridFields.Message
        });
    }
}

const CheckableMessageGridFields = {
    Message: 'Message'
};
