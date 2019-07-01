import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class MembershipGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getMembershipGridColumns();
        return this.columns;
    }

    private getMembershipGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Team', id: 'user.preferences.membershipgrid.team' }),
            field: MembershipGridFields.TeamName,
            width: 40
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Description', id: 'user.preferences.membershipgrid.description' }),
            field: MembershipGridFields.Description,
            width: 60
        });
    }
}

const MembershipGridFields = {
    TeamName: 'TeamName',
    Description: 'Description'
};
