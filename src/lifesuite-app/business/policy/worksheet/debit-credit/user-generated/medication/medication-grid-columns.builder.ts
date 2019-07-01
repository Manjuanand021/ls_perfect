import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { MetadataUtil } from 'ls-core/util';
import { LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class MedicationColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(cellFormatters: CellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Condtion', id: 'policy.medication.gridheader.condition' }),
            field: MedicationFields.Condition,
            width: 100,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Medication', id: 'policy.worksheet.debitcredit.gridheader.medication' }),
            field: MedicationFields.DrugName,
            width: 200,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.medicalcondition.gridheader.​createdby' }),
            field: MedicationFields.AddedBy,
            width: 100,
            valueFormatter: this.getUserName,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.medicalcondition.gridheader.createdon' }),
            field: MedicationFields.Added,
            width: 100,
            valueFormatter: params => this._cellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.worksheet.debitcredit.gridheader.debitcredit' }),
            field: MedicationFields.Points,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 100
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.node.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.node.data.AddedBy);
        }
    }
}

export const MedicationFields = {
    Condition: 'Condition',
    DrugName: 'DrugName',
    AddedBy: 'AddedBy',
    Added: 'Added',
    Points: 'Points'
};
