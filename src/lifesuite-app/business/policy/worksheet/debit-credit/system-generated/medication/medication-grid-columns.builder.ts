import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class MedicationColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(
        cellFormatters: CellFormatters,
        lsCellFormatters: LsCellFormatters,
        lsCellComparators: LsCellComparators,
        i18n: I18n
    ) {
        super();
        this._cellFormatters = cellFormatters;
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Condtion', id: 'policy.medication.gridheader.condition' }),
            field: MedicationFields.Condition,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Medication', id: 'policy.worksheet.debitcredit.gridheader.medication' }),
            field: MedicationFields.DrugName,
            width: 140,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.medication.gridheader.createdon' }),
            field: MedicationFields.Added,
            width: 80,
            valueFormatter: params => this._cellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medication.gridheader.points' }),
            field: MedicationFields.Points,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 80
        });
        return this.columns;
    }
}

export const MedicationFields = {
    Condition: 'Condition',
    DrugName: 'DrugName',
    Added: 'Added',
    Points: 'Points'
};
