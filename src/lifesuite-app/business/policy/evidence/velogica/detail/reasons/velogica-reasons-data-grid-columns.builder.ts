import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

const VelogicaDetailFields = {
    ReasonCode: 'ReasonCode',
    ReasonDescription: 'ReasonDescription',
    CategoryCode: 'CategoryCode',
    ReasonSource: 'ReasonSource'
};
@Injectable()
export class VelogicaReasonsDataColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Reason Code', id: 'policy.velogica.detail.gridheader.reasoncode' }),
            field: VelogicaDetailFields.ReasonCode,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Reason Description',
                id: 'policy.velogica.detail.gridheader.reasondescription'
            }),
            field: VelogicaDetailFields.ReasonDescription,
            width: 300
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Category Code', id: 'policy.velogica.detail.gridheader.category' }),
            field: VelogicaDetailFields.CategoryCode,
            width: 50
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Reason Source', id: 'policy.velogica.detail.gridheader.reasonsource' }),
            field: VelogicaDetailFields.ReasonSource,
            width: 50
        });
        return this.columns;
    }
}
