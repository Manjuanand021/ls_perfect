import { Injectable } from '@angular/core';

import {
    BaseGridColumnsBuilder,
    DataGridColumns,
    GridFilterFrameworkComponentType,
    TextFilterOptionExt,
    IDataGridColumn,
    CellFormatters
} from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters } from 'ls-core/component/grid';
import { MetadataItem } from 'ls-core/model';
import { MetadataUtil } from 'ls-core/util';
import { SortOrderTypes } from 'ls-core/model/const/sort-order-types';

type ColumnsMapType = { readonly [CaseListGridField: string]: IDataGridColumn };

const CaseListGridFields = {
    Priority: 'Priority',
    CompanyCode: 'CompanyCode',
    PolicyNumber: 'PolicyNumber',
    PlanCodeId: 'PlanCodeId',
    ApplicantStatusShort: 'ApplicantStatusShort',
    ApplicantStatusDate: 'ApplicantStatusDate',
    InsuredName: 'InsuredName',
    InsuredNameFull: 'InsuredNameFull',
    InsuredTaxId: 'InsuredTaxId',
    InsuredUnderwritingAmount: 'InsuredUnderwritingAmount',
    AddedDate: 'AddedDate',
    UnderwriterNameShort: 'UnderwriterNameShort',
    ServiceAssociateNameShort: 'ServiceAssociateNameShort',
    TeamName: 'TeamName',
    CaseGroupId: 'CaseGroupId',
    InsuredClientId: 'InsuredClientId',
    InsuredBirthDate: 'InsuredBirthDate',
    AlternateCaseId: 'AlternateCaseId',
    SourceInfo: 'SourceInfo',
    DistributorCode: 'DistributorCode',
    AgencyNumber: 'AgencyNumber',
    AssociationCode: 'AssociationCode',
    AgentNumber: 'AgentNumber',
    GNumber: 'GNumber',
    ApplicationSourceType: 'ApplicationSourceType',
    CountryName: 'CountryName',
    StateName: 'StateName',
    MarketingCode: 'MarketingCode'
};

@Injectable()
export class CaseListGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;
    private _lsCellFormatters: LsCellFormatters;
    private _configuredDisplayFields: string[];
    private _caseListColumnsMap: ColumnsMapType = {};

    constructor(cellFormatters: CellFormatters, lsCellFormatters: LsCellFormatters, i18n: I18n) {
        super();
        this.i18n = i18n;
        this._cellFormatters = cellFormatters;
        this._lsCellFormatters = lsCellFormatters;
        this._caseListColumnsMap = {
            [CaseListGridFields.Priority]: {
                headerName: this.i18n({ value: 'Priority', id: 'search.tab.grid.priority' }),
                field: CaseListGridFields.Priority,
                filter: GridFilterFrameworkComponentType.NumericFilter
            },
            [CaseListGridFields.CompanyCode]: {
                headerName: this.i18n({ value: 'Company', id: 'search.tab.grid.company' }),
                field: CaseListGridFields.CompanyCode,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.PolicyNumber]: {
                headerName: this.i18n({ value: 'Case #', id: 'search.tab.grid.casenumber' }),
                field: CaseListGridFields.PolicyNumber,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.PlanCodeId]: {
                headerName: this.i18n({ value: 'Plan Code', id: 'search.tab.grid.plancode' }),
                field: CaseListGridFields.PlanCodeId,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.ApplicantStatusShort]: {
                headerName: this.i18n({ value: 'Status Code', id: 'search.tab.grid.statuscode' }),
                field: CaseListGridFields.ApplicantStatusShort,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.ApplicantStatusDate]: {
                headerName: this.i18n({ value: 'Status Date', id: 'search.tab.grid.statusdate' }),
                field: CaseListGridFields.ApplicantStatusDate,
                valueFormatter: this._lsCellFormatters.dateCellFormatter,
                filter: GridFilterFrameworkComponentType.DateFilter
            },
            [CaseListGridFields.InsuredName]: {
                headerName: this.i18n({ value: 'Applicant', id: 'search.tab.grid.applicant' }),
                field: CaseListGridFields.InsuredName,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.InsuredNameFull]: {
                headerName: this.i18n({ value: 'Applicant', id: 'search.tab.grid.applicant' }),
                field: CaseListGridFields.InsuredNameFull,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.InsuredTaxId]: {
                headerName: this.i18n({ value: 'Tax ID', id: 'search.tab.grid.taxid' }),
                field: CaseListGridFields.InsuredTaxId,
                filter: GridFilterFrameworkComponentType.TextFilter,
                filterParams: { filterOptionExt: new TextFilterOptionExt({ regExp: /[0-9]/ }) }
            },
            [CaseListGridFields.InsuredUnderwritingAmount]: {
                headerName: this.i18n({ value: 'U/W Amount', id: 'search.tab.grid.uwamount' }),
                field: CaseListGridFields.InsuredUnderwritingAmount,
                valueFormatter: this._cellFormatters.decimalCellFormatter,
                filter: GridFilterFrameworkComponentType.NumericFilter
            },
            [CaseListGridFields.AddedDate]: {
                headerName: this.i18n({ value: 'LS Received Date', id: 'search.tab.grid.lsreceiveddate' }),
                field: CaseListGridFields.AddedDate,
                valueFormatter: this._lsCellFormatters.dateCellFormatter,
                filter: GridFilterFrameworkComponentType.DateFilter
            },
            [CaseListGridFields.UnderwriterNameShort]: {
                headerName: this.i18n({ value: 'Underwriter', id: 'search.tab.grid.underwriter' }),
                field: CaseListGridFields.UnderwriterNameShort,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.ServiceAssociateNameShort]: {
                headerName: this.i18n({ value: 'Case Manager', id: 'search.tab.grid.casemanager' }),
                field: CaseListGridFields.ServiceAssociateNameShort,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.TeamName]: {
                headerName: this.i18n({ value: 'Team', id: 'search.tab.grid.team' }),
                field: CaseListGridFields.TeamName,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.CaseGroupId]: {
                headerName: this.i18n({ value: 'Family / Case ID', id: 'search.tab.grid.familycaseid' }),
                field: CaseListGridFields.CaseGroupId,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.InsuredClientId]: {
                headerName: this.i18n({ value: 'Client ID', id: 'search.tab.grid.clientid' }),
                field: CaseListGridFields.InsuredClientId,
                filter: GridFilterFrameworkComponentType.TextFilter
            },

            [CaseListGridFields.AlternateCaseId]: {
                headerName: this.i18n({ value: 'Alt Case #', id: 'search.tab.grid.altcasenumber' }),
                field: CaseListGridFields.AlternateCaseId,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.SourceInfo]: {
                headerName: this.i18n({ value: 'Source Info', id: 'search.tab.grid.sourceinfo' }),
                field: CaseListGridFields.SourceInfo,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.DistributorCode]: {
                headerName: this.i18n({ value: 'Dist. Code', id: 'search.tab.grid.distcode' }),
                field: CaseListGridFields.DistributorCode,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.AgencyNumber]: {
                headerName: this.i18n({ value: 'Agency #', id: 'search.tab.grid.agencynumber' }),
                field: CaseListGridFields.AgencyNumber,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.AssociationCode]: {
                headerName: this.i18n({ value: 'Association', id: 'search.tab.grid.associationcode' }),
                field: CaseListGridFields.AssociationCode,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.InsuredBirthDate]: {
                headerName: this.i18n({ value: 'Birth Date', id: 'search.tab.grid.insuredbirthdate' }),
                field: CaseListGridFields.InsuredBirthDate,
                valueFormatter: this._lsCellFormatters.dateCellFormatter,
                filter: GridFilterFrameworkComponentType.DateFilter
            },
            [CaseListGridFields.AgentNumber]: {
                headerName: this.i18n({ value: 'Agent #', id: 'search.tab.grid.agentnumber' }),
                field: CaseListGridFields.AgentNumber,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.GNumber]: {
                headerName: this.i18n({ value: 'Group #', id: 'search.tab.grid.gnumber' }),
                field: CaseListGridFields.GNumber,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.ApplicationSourceType]: {
                headerName: this.i18n({
                    value: 'Application Source Type',
                    id: 'policy.case.distribution.appSourceType'
                }),
                field: CaseListGridFields.ApplicationSourceType,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.CountryName]: {
                headerName: this.i18n({ value: 'Country', id: 'policy.case.agents.country' }),
                field: CaseListGridFields.CountryName,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.StateName]: {
                headerName: this.i18n({ value: 'State', id: 'policy.case.agents.state' }),
                field: CaseListGridFields.StateName,
                filter: GridFilterFrameworkComponentType.TextFilter
            },
            [CaseListGridFields.MarketingCode]: {
                headerName: this.i18n({ value: 'Marketing Code', id: 'policy.case.distribution.marketingCode' }),
                field: CaseListGridFields.MarketingCode,
                filter: GridFilterFrameworkComponentType.TextFilter
            }
        };
    }

    public build(system: MetadataItem[], searchScreenConfiguration: MetadataItem[]): DataGridColumns {
        this.resetColumns();
        this._configuredDisplayFields = this.getDisplayFields(searchScreenConfiguration);
        this.setSortOrderForLsReceivedDate(searchScreenConfiguration);
        this.setupValueFormatterForTaxIDColumn(this.getMaskTaxIDValue(system));
        this.setupCaseListGridColumns();
        return this.columns;
    }

    private setupCaseListGridColumns(): void {
        Object.keys(this._caseListColumnsMap).forEach((searchCaseGridField: string) => {
            if (this.columnExist(searchCaseGridField)) {
                this.addColumn(this._caseListColumnsMap[searchCaseGridField]);
            }
        });
    }

    private setupValueFormatterForTaxIDColumn(maskTaxID: boolean): void {
        if (maskTaxID) {
            this._caseListColumnsMap[
                CaseListGridFields.InsuredTaxId
            ].valueFormatter = this._lsCellFormatters.taxIdFormatter;
        }
    }

    private getDisplayFields(searchScreenValues: MetadataItem[]): string[] {
        return MetadataUtil.getLabelByValue(searchScreenValues, 'DisplayFields').split(',');
    }

    private setSortOrderForLsReceivedDate(searchScreenValues: MetadataItem[]): void {
        this._caseListColumnsMap[CaseListGridFields.AddedDate].sort =
            MetadataUtil.getLabelByValue(searchScreenValues, 'DisplayRecords').toUpperCase() === 'DESCENDING'
                ? SortOrderTypes.Descending
                : SortOrderTypes.Ascending;
    }

    private getMaskTaxIDValue(system: MetadataItem[]): boolean {
        return MetadataUtil.getLabelByValue(system, 'TaxIDMasking') === 'true';
    }

    private columnExist(column: string): boolean {
        return !!this._configuredDisplayFields.find(field => field === column);
    }

    public resetColumns(): void {
        this.columns.removeAll();
    }
}
