import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';
import { DateTimeFormatWidth } from 'life-core/util';

import { MetadataUtil } from 'ls-core/util';
import { LsCellComparators } from 'ls-core/component/grid';

const MedicalConditionGridFields = {
    BodilySystem: 'BodilySystem',
    Condition: 'Condition',
    Criteria: 'Criteria',
    TimeOfCriteria: 'TimeOfCriteria',
    AddedBy: 'AddedBy',
    Added: 'Added',
    Points: 'Points'
};

@Injectable()
export class MedicalConditionGridColumnsBuilder extends BaseGridColumnsBuilder {
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
            headerName: this.i18n({ value: 'Bodily System', id: 'policy.medicalcondition.gridheader.bodilysystem' }),
            field: MedicalConditionGridFields.BodilySystem,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Condition', id: 'policy.medicalcondition.gridheader.condition' }),
            field: MedicalConditionGridFields.Condition,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Criteria', id: 'policy.medicalcondition.gridheader.criteria' }),
            field: MedicalConditionGridFields.Criteria,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Time', id: 'policy.medicalcondition.gridheader.time' }),
            field: MedicalConditionGridFields.TimeOfCriteria,
            width: 80,
            autoHeight: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.medicalcondition.gridheader.createdby' }),
            field: MedicalConditionGridFields.AddedBy,
            width: 80,
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Date/Time', id: 'policy.medicalcondition.gridheader.datetime' }),
            field: MedicalConditionGridFields.Added,
            width: 80,
            valueFormatter: params => this._cellFormatters.dateCellFormatter(params, DateTimeFormatWidth.Short),
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Debit/Credit', id: 'policy.medicalcondition.gridheader.points' }),
            field: MedicalConditionGridFields.Points,
            width: 80,
            valueFormatter: params => this._cellFormatters.decimalCellFormatter(params, '1.0-0')
        });
        return this.columns;
    }

    private getUserName(params: any): string {
        if (params.node.data.IsSystemGenerated === 'true') {
            return 'System Generated';
        } else if (params.node.data.AddedBy === null) {
            return '';
        } else if (params.node.data.AddedBy === -255) {
            return 'System';
        } else if (params.node.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.node.data.AddedBy);
        }
    }
}
