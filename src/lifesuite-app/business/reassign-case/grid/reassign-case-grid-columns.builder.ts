import { Injectable } from '@angular/core';

import {
    BaseGridColumnsBuilder,
    DataGridColumns,
    GridFilterFrameworkComponentType,
    CellFormatters
} from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters } from 'ls-core/component/grid';

@Injectable()
export class ReassignCaseGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellFormatters: LsCellFormatters;

    constructor(cellFormatters: CellFormatters, lsCellFormatters: LsCellFormatters, i18n: I18n) {
        super();
        this.i18n = i18n;
        this._cellFormatters = cellFormatters;
        this._lsCellFormatters = lsCellFormatters;
    }

    public build(): DataGridColumns {
        this.getReassignCaseGridColumns();
        return this.columns;
    }

    private getReassignCaseGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Case#', id: 'policy.reassign.case.grid.casenumber' }),
            field: ReassignCaseGridFields.PolicyNumber,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'policy.reassign.case.grid.applicant' }),
            field: ReassignCaseGridFields.InsuredNameFull,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Line of Business', id: 'policy.reassign.case.grid.lineofbusiness' }),
            field: ReassignCaseGridFields.LineOfBusinessCode,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Plan Code', id: 'policy.reassign.case.grid.plancode' }),
            field: ReassignCaseGridFields.PrimaryPlanCode,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Face Amount', id: 'policy.reassign.case.grid.faceamount' }),
            field: ReassignCaseGridFields.InsuredUnderwritingAmount,
            width: 100,
            valueFormatter: this._cellFormatters.decimalCellFormatter,
            filter: GridFilterFrameworkComponentType.NumericFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Assigned UW', id: 'policy.reassign.case.grid.assigneduw' }),
            field: ReassignCaseGridFields.UnderwriterName,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Assigned CM', id: 'policy.reassign.case.grid.assignedcm' }),
            field: ReassignCaseGridFields.ServiceAssociateName,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Agent', id: 'policy.reassign.case.grid.agent' }),
            field: ReassignCaseGridFields.Agent,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Agency', id: 'policy.reassign.case.grid.agency' }),
            field: ReassignCaseGridFields.Agency,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Franchise / Association', id: 'policy.reassign.case.grid.franchise' }),
            field: ReassignCaseGridFields.AssociationCode,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'LifeSuite Rec. Date', id: 'policy.reassign.case.grid.lifesuiterecdate' }),
            field: ReassignCaseGridFields.AddedDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter
        });
    }
}

const ReassignCaseGridFields = {
    PolicyNumber: 'PolicyNumber', // policy.reassign.case.grid.casenumber
    InsuredNameFull: 'InsuredNameFull', // policy.reassign.case.grid.applicant
    InsuredUnderwritingAmount: 'InsuredUnderwritingAmount', // policy.reassign.case.grid.casenumber
    UnderwriterName: 'UnderwriterName', // policy.reassign.case.grid.assigneduw
    LineOfBusinessCode: 'LineOfBusinessCode', // policy.reassign.case.grid.lineofbusiness
    PrimaryPlanCode: 'PrimaryPlanCode', // policy.reassign.case.grid.plancode
    ServiceAssociateName: 'ServiceAssociateName', // policy.reassign.case.grid.assignedcm
    Agent: 'Agent', // policy.reassign.case.grid.agent
    Agency: 'Agency', // policy.reassign.case.grid.agency
    AssociationCode: 'AssociationCode', // policy.reassign.case.grid.franchise
    AddedDate: 'AddedDate' // policy.reassign.case.grid.lifesuiterecdate
};
