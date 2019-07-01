import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class AuthorizationLimitGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getAuthorizationLimitGridColumns();
        return this.columns;
    }

    private getAuthorizationLimitGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({
                value: 'Line Of Business',
                id: 'user.preferences.authlimitgrid.lob'
            }),
            field: AuthorizationLimitGridFields.LineOfBusinessCode,
            width: 50
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Minimum Authorization',
                id: 'user.preferences.authlimitgrid.minauthorization'
            }),
            field: AuthorizationLimitGridFields.AuthorizationMinimum,
            width: 25
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Maximum Authorization',
                id: 'user.preferences.authlimitgrid.maxauthorization'
            }),
            field: AuthorizationLimitGridFields.AuthorizationLimit,
            width: 25
        });
    }
}

const AuthorizationLimitGridFields = {
    LineOfBusinessCode: 'LineOfBusinessCode',
    AuthorizationMinimum: 'AuthorizationMinimum',
    AuthorizationLimit: 'AuthorizationLimit'
};
