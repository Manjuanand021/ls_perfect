import { Component, Injector } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { DataGridColumns, BaseInfiniteGridViewModel } from 'life-core/component/grid';
import { ConvertUtil } from 'life-core/util/lang';

import { PolicyByProductProxyDTO } from 'ls-core/model';

import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { GridDataStateKeys } from 'business/shared/grid';

import { CaseListGridColumnsBuilder } from './case-list-grid-columns.builder';
import { SearchCaseGridDataSource } from '../datasource/search-case-grid-datasource';
import { SearchCaseChannels } from '../search-case-channels';
import { ExportCasesService } from '../export-case-service/export-case.service';

@Component({
    selector: 'case-list',
    templateUrl: './case-list.component.html',
    providers: [SearchCaseGridDataSource, CaseListGridColumnsBuilder, ExportCasesService]
})
export class CaseListComponent extends BaseInfiniteGridViewModel<PolicyByProductProxyDTO> {
    public isExportButtonDisabled: boolean;
    public isOpenButtonDisabled: boolean;

    private _openPolicyDelegate: OpenPolicyDelegate;
    private _exportCasesList: Array<PolicyByProductProxyDTO> = [];
    private _exportCasesService: ExportCasesService;

    constructor(
        injector: Injector,
        gridDataSource: SearchCaseGridDataSource,
        gridColumnsBuilder: CaseListGridColumnsBuilder,
        openPolicyDelegate: OpenPolicyDelegate,
        i18n: I18n,
        exportCasesService: ExportCasesService
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this._openPolicyDelegate = openPolicyDelegate;
        this.filterModel = new PolicyByProductProxyDTO();
        this._exportCasesService = exportCasesService;
        this.isExportButtonDisabled = true;
        this.isOpenButtonDisabled = true;
        this.i18n = i18n;
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build(this.listData['system'], this.listData['SearchScreenConfiguration']);
    }

    public onOpenPolicyButtonClick(): void {
        this.openSelectedGridRow();
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this.isOpenButtonDisabled = false;
        this.selectedGridRows = [$event.node.data];
    }

    protected openSelectedGridRow(): void {
        if (this.anyGridRowsSelected()) {
            this.updateGridRowsState();
            this._openPolicyDelegate.openPolicy(
                ConvertUtil.toNumber(this.selectedGridRows[0].PolicyId),
                this.selectedGridRows[0].PolicyNumber
            );
        } else {
            this.showNoRowSelectedDialog(
                this.i18n({ value: 'Please select a policy.', id: 'searchcase.caselist.alertmsg.selectpolicy' }),
                this.i18n({ value: 'Open Policy', id: 'searchcase.caselist.alertmsg.openpolicy' })
            );
        }
    }

    public exportCases(): void {
        const uniquePolicySet = new Set<string>(this._exportCasesList.map(policy => policy.PolicyNumber));
        if (uniquePolicySet.size > 0) {
            this._exportCasesService.exportCases(Array.from(uniquePolicySet).join(','));
        }
    }

    protected setupDataOnRowsReceived(rows: Array<PolicyByProductProxyDTO>): void {
        this.updateExportButton(rows);
        this.updateCaseList(rows);
        super.setupDataOnRowsReceived(rows);
    }

    private updateExportButton(rows: Array<PolicyByProductProxyDTO>): void {
        this.isExportButtonDisabled = rows.length <= 0;
    }

    private updateCaseList(rows: Array<PolicyByProductProxyDTO>): void {
        this._exportCasesList = this._exportCasesList.concat(rows);
    }

    protected registerFilterChangeHandlers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(SearchCaseChannels.SearchCaseCriteriaChanged, PolicyByProductProxyDTO => {
                this.onFilterModelReceived(PolicyByProductProxyDTO, true, true);
                this.resetExportCasesList();
            })
        );
    }

    protected getGridStateKey(): string {
        return GridDataStateKeys.SEARCH_CASE;
    }

    protected rowDataMatch(rowData1: PolicyByProductProxyDTO, rowData2: PolicyByProductProxyDTO): boolean {
        return (
            rowData1.PolicyId === rowData2.PolicyId &&
            rowData1.PolicyPersonId === rowData2.PolicyPersonId &&
            rowData1.PlanCodeId === rowData2.PlanCodeId &&
            rowData1.AgentNumber === rowData2.AgentNumber
        );
    }

    private resetExportCasesList(): void {
        this._exportCasesList = [];
    }
}
