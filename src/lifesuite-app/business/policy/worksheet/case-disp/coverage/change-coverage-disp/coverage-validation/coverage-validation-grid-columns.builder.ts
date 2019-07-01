import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';

import { CoverageValidationIconHelper } from './coverage-validation-icon.helper';
import { ValidationMessageType } from './validation-message.type';

@Injectable()
export class CoverageValidationGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getCoverageValidationGridColumns();
        return this.columns;
    }

    private getCoverageValidationGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Checked', id: 'policy.worksheet.coverageValidationChecked' }),
            checkboxSelection: this.isOverridableMessage,
            width: 3
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Type', id: 'policy.worksheet.coverageValidationType' }),
            field: CoverageValidationGridFields.Type,
            cellRenderer: this.getIcon,
            width: 3
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Message', id: 'policy.worksheet.coverageValidationMessage' }),
            field: CoverageValidationGridFields.Message,
            width: 94
        });
    }

    private getIcon(params: any): string {
        return CoverageValidationIconHelper.getIcon(params.data);
    }

    private isOverridableMessage(params: any): boolean {
        return params.data && params.data.Type == ValidationMessageType.Overridable;
    }
}

const CoverageValidationGridFields = {
    Checked: 'Checked',
    Type: 'Type',
    Message: 'Message'
};
