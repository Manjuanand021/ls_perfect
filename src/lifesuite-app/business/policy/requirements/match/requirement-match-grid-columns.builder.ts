import { Injectable } from '@angular/core';

import {
    BaseGridColumnsBuilder,
    DataGridColumns,
    GridFilterFrameworkComponentType,
    TextFilterOptionExt
} from 'life-core/component/grid';
import { LsCellFormatters } from 'ls-core/component/grid';
import { I18n } from 'life-core/i18n';

import { RequirementTypes } from './../requirement.type';

@Injectable()
export class RequirementMatchGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _requirementType: RequirementTypes;

    constructor(lsCellFormatters: LsCellFormatters, i18n: I18n, requirementTypes: RequirementTypes) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this.i18n = i18n;
        this._requirementType = requirementTypes;
    }

    public build(requirementType: string): DataGridColumns {
        if (this.isMVRRequirementGrid(requirementType)) {
            this.getMVRRequirementMatchGridColumns();
        } else {
            this.getLabRequirementMatchGridColumns();
        }
        return this.columns;
    }

    private isMVRRequirementGrid(requirementType: string): boolean {
        return requirementType == this._requirementType.mvr;
    }

    private getMVRRequirementMatchGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Last Name', id: 'policy.matching.lab.lastname' }),
            field: RequirementMatchGridFields.LastName,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'First Name', id: 'policy.matching.lab.firstname' }),
            field: RequirementMatchGridFields.FirstName,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'License Number', id: 'policy.matching.mvr.licensenumber' }),
            field: RequirementMatchGridFields.LicenseNumber,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'State', id: 'policy.matching.mvr.state' }),
            field: RequirementMatchGridFields.State,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Report Status', id: 'policy.matching.mvr.reportstatus' }),
            field: RequirementMatchGridFields.ReportStatus,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Tax ID', id: 'policy.matching.mvr.taxid' }),
            field: RequirementMatchGridFields.TaxID,
            valueFormatter: this._lsCellFormatters.taxIdFormatter,
            filter: GridFilterFrameworkComponentType.TextFilter,
            filterParams: { filterOptionExt: new TextFilterOptionExt({ regExp: /[0-9]/ }) }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Report Date', id: 'policy.matching.mvr.reportdate' }),
            field: RequirementMatchGridFields.ReportDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Birth Date', id: 'policy.matching.lab.birthdate' }),
            field: RequirementMatchGridFields.BirthDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter
        });
    }

    private getLabRequirementMatchGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Last Name', id: 'policy.matching.lab.lastname' }),
            field: RequirementMatchGridFields.LastName,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'First Name', id: 'policy.matching.lab.firstname' }),
            field: RequirementMatchGridFields.FirstName,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Middle Name', id: 'policy.matching.lab.middlename' }),
            field: RequirementMatchGridFields.MiddleName,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Lab ID', id: 'policy.matching.lab.labid' }),
            field: RequirementMatchGridFields.LabID,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Drawn Date', id: 'policy.matching.lab.drawndate' }),
            field: RequirementMatchGridFields.DrawnDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Tax ID', id: 'policy.matching.lab.taxid' }),
            field: RequirementMatchGridFields.SSN,
            valueFormatter: this._lsCellFormatters.taxIdFormatter,
            filter: GridFilterFrameworkComponentType.TextFilter,
            filterParams: { filterOptionExt: new TextFilterOptionExt({ regExp: /[0-9]/ }) }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Gender', id: 'policy.matching.lab.sex' }),
            field: RequirementMatchGridFields.Gender,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Birth Date', id: 'policy.matching.lab.birthdate' }),
            field: RequirementMatchGridFields.BirthDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter
        });
    }
}

const RequirementMatchGridFields = {
    LastName: 'LastName',
    FirstName: 'FirstName',
    LicenseNumber: 'LicenseNumber',
    State: 'State',
    ReportStatus: 'ReportStatus',
    TaxID: 'SocSecNo',
    ReportDate: 'ReportDate',
    BirthDate: 'BirthDate',
    MiddleName: 'MiddleName',
    LabID: 'LabIdNumber',
    DrawnDate: 'DrawnDate',
    SSN: 'Ssn',
    Gender: 'Sex'
};
