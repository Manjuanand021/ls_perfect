import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { MetadataUtil } from 'ls-core/util';
import { LsCellComparators } from 'ls-core/component/grid';

const MedicationFields = {
    Condition: 'Condition',
    DrugName: 'DrugName',
    AddedBy: 'AddedBy',
    Added: 'Added',
    Points: 'Points'
};

@Injectable()
export class RxOtherMedicationColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Condition', id: 'policy.medication.gridheader.condition' }),
            field: MedicationFields.Condition,
            width: 120,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Medication', id: 'policy.medication.gridheader.drugname' }),
            field: MedicationFields.DrugName,
            width: 120,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.medication.gridheader.createdby' }),
            field: MedicationFields.AddedBy,
            width: 120,
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Date/Time', id: 'policy.worksheet.debitcredit.gridheader.createdon' }),
            field: MedicationFields.Added,
            width: 120,
            valueFormatter: params => this._cellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medication.gridheader.points' }),
            field: MedicationFields.Points,
            width: 100,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0')
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.node.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.node.data.AddedBy);
        }
    }
}
