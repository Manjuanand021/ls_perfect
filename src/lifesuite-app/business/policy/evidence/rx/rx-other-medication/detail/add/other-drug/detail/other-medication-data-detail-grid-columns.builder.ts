import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

const MedicationFields = {
    DrugName: 'DrugName',
    Debit: 'Points'
};
@Injectable()
export class OtherMedicationDataDetailColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Drug Name', id: 'policy.rx.detail.effects.gridheader.drugname' }),
            field: MedicationFields.DrugName,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medication.gridheader.points' }),
            field: MedicationFields.Debit,
            width: 200,
            valueFormatter: this._cellFormatters.decimalCellFormatter
        });
        return this.columns;
    }
}
