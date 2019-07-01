import { Injectable } from '@angular/core';

import {
    BaseGridColumnsBuilder,
    DataGridColumns,
    CellFormatters,
    GridFilterFrameworkComponentType
} from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters } from 'ls-core/component/grid';
import { PolicyViewType } from 'business/shared/view-type/policy-view-type';

@Injectable()
export class PolicyListGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellFormatters: LsCellFormatters;

    constructor(cellFormatters: CellFormatters, lsCellFormatters: LsCellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this._lsCellFormatters = lsCellFormatters;
        this.i18n = i18n;
    }

    public build(selectedView: PolicyViewType): DataGridColumns {
        this.resetColumns();
        if (selectedView == PolicyViewType.Case) {
            this.getCaseViewGridColumns();
        } else {
            this.getApplicantViewGridColumns();
        }
        return this.columns;
    }

    private getApplicantViewGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Company', id: 'mywork.applicants.gridheader.companycode' }),
            field: PolicyGridFields.Company,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'mywork.applicants.gridheader.policynumber' }),
            field: PolicyGridFields.PolicyNumber,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Plan Code', id: 'mywork.applicants.gridheader.primaryplancode' }),
            field: PolicyGridFields.PlanCode,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Priority', id: 'mywork.applicants.gridheader.priority' }),
            field: PolicyGridFields.Priority,
            filter: GridFilterFrameworkComponentType.NumericFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'mywork.applicants.gridheader.policystatuscode' }),
            field: PolicyGridFields.Status,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status Date', id: 'mywork.applicants.gridheader.policystatusdate' }),
            field: PolicyGridFields.StatusDate,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'mywork.applicants.gridheader.insuredname' }),
            field: PolicyGridFields.InsuredNameFull,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'U/W Amount', id: 'mywork.applicants.gridheader.faceamount' }),
            field: PolicyGridFields.UnderwritingAmount,
            filter: GridFilterFrameworkComponentType.NumericFilter,
            valueFormatter: this._cellFormatters.decimalCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Rcv. Date', id: 'mywork.applicants.gridheader.receivedate' }),
            field: PolicyGridFields.ReceivedDate,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Underwriter', id: 'mywork.applicants.gridheader.underwritername' }),
            field: PolicyGridFields.Underwriter,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Service Associate',
                id: 'mywork.applicants.gridheader.serviceassociatename'
            }),
            field: PolicyGridFields.ServiceAssociate,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Team', id: 'mywork.applicants.gridheader.teamname' }),
            field: PolicyGridFields.Team,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Agency #', id: 'mywork.applicants.gridheader.agencynumber' }),
            field: PolicyGridFields.Agency,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Last Activity', id: 'mywork.applicants.gridheader.lastactivity' }),
            field: PolicyGridFields.UpdatedDate,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
    }

    private getCaseViewGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Company', id: 'mywork.applicants.gridheader.companycode' }),
            field: PolicyGridFields.Company,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'mywork.applicants.gridheader.policynumber' }),
            field: PolicyGridFields.PolicyNumber,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'mywork.applicants.gridheader.insuredname' }),
            field: PolicyGridFields.InsuredNameFull,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Rcv. Date', id: 'mywork.applicants.gridheader.receivedate' }),
            field: PolicyGridFields.ReceivedDate,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Underwriter', id: 'mywork.applicants.gridheader.underwritername' }),
            field: PolicyGridFields.Underwriter
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Service Associate',
                id: 'mywork.applicants.gridheader.serviceassociatename'
            }),
            field: PolicyGridFields.ServiceAssociate,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Team', id: 'mywork.applicants.gridheader.teamname' }),
            field: PolicyGridFields.Team,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Agency #', id: 'mywork.applicants.gridheader.agencynumber' }),
            field: PolicyGridFields.Agency,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Last Activity', id: 'mywork.applicants.gridheader.lastactivity' }),
            field: PolicyGridFields.UpdatedDate,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: this._lsCellFormatters.dateCellFormatter
        });
    }
}

const PolicyGridFields = {
    PolicyNumber: 'PolicyNumber',
    InsuredNameFull: 'InsuredNameFull',
    InsuredLastName: 'InsuredLastName',
    InsuredFirstName: 'InsuredFirstName',
    InsuredMiddleName: 'InsuredMiddleName',
    Company: 'CompanyCode',
    PlanCode: 'PrimaryPlanCode',
    Priority: 'Priority',
    Status: 'ApplicantStatusShort',
    StatusDate: 'ApplicantStatusDate',
    UnderwritingAmount: 'InsuredUnderwritingAmount',
    ReceivedDate: 'AddedDate',
    Underwriter: 'UnderwriterNameShort',
    ServiceAssociate: 'ServiceAssociateNameShort',
    Team: 'TeamName',
    Agency: 'AgencyNumber',
    UpdatedDate: 'UpdatedDate'
};
