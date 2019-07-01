import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class LabResultDetailGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'ANSI', id: 'policy.lab.detail.ansi.gridheader.ansi' }),
            field: LabResultDetailGridFields.HorlCode,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Test', id: 'policy.lab.detail.ansi.gridheader.test' }),
            field: LabResultDetailGridFields.Description,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Abnormal', id: 'policy.lab.detail.ansi.gridheader.normal' }),
            field: LabResultDetailGridFields.Abnormal,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Normal', id: 'policy.lab.detail.ansi.gridheader.abnormal' }),
            field: LabResultDetailGridFields.Normal,
            width: 80
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Normal Range', id: 'policy.lab.detail.ansi.gridheader.normalrange' }),
            field: LabResultDetailGridFields.RangeText,
            width: 80
        });
        return this.columns;
    }
}

const LabResultDetailGridFields = {
    HorlCode: 'HorlCode',
    Description: 'Description',
    Abnormal: 'Abnormal',
    Normal: 'Normal',
    RangeText: 'RangeText'
};
