import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

const MedicationFields = {
    DrugName: 'DrugName',
    Debit: 'Points'
};
@Injectable()
export class OtherMedicationDataListColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Listed Medicated Drug', id: 'policy.medication.editgrid.drugname' }),
            field: MedicationFields.DrugName,
            width: 50
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medication.gridheader.points' }),
            field: MedicationFields.Debit,
            width: 50,
            valueFormatter: this._cellFormatters.decimalCellFormatter
        });
        return this.columns;
    }
}
