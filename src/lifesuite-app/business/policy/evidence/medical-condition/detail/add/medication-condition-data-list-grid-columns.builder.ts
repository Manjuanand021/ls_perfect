import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

const MedicationFields = {
    Criteria: 'Criteria',
    Debit: 'Points',
    TimeOfCriteria: 'TimeOfCriteria'
};
@Injectable()
export class MedicationConditionDataListColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({
                value: 'Listed Criteria',
                id: 'policy.medicalcondition.gridheader.listedcriteria'
            }),
            field: MedicationFields.Criteria,
            width: 50,
            checkboxSelection: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medicalcondition.gridheader.points' }),
            field: MedicationFields.Debit,
            width: 50,
            valueFormatter: this._cellFormatters.decimalCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Time of Criteria',
                id: 'policy.medicalcondition.gridheader.timeofcriteria'
            }),
            field: MedicationFields.TimeOfCriteria,
            width: 50
        });
        return this.columns;
    }
}
