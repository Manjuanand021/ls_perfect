import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

@Injectable()
export class MedicalConditionColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Bodily System', id: 'policy.medicalcondition.gridheader.​bodilysystem' }),
            field: MedicalConditionFields.BodilySystem,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Condition', id: 'policy.medicalcondition.gridheader.condition' }),
            field: MedicalConditionFields.Condition,
            width: 140,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Criteria', id: 'policy.medicalcondition.gridheader.criteria' }),
            field: MedicalConditionFields.Criteria,
            width: 100,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Time', id: 'policy.worksheet.debitcredit.gridheader.time' }),
            field: MedicalConditionFields.TimeOfCriteria,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.medicalcondition.gridheader.createdon' }),
            field: MedicalConditionFields.Added,
            width: 100,
            valueFormatter: params => this._cellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.worksheet.debitcredit.gridheader.debitcredit' }),
            field: MedicalConditionFields.Points,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0'),
            width: 80
        });
        return this.columns;
    }
}

export const MedicalConditionFields = {
    BodilySystem: 'BodilySystem',
    Condition: 'Condition',
    Criteria: 'Criteria',
    TimeOfCriteria: 'TimeOfCriteria',
    Added: 'Added',
    Points: 'Points' //
};
