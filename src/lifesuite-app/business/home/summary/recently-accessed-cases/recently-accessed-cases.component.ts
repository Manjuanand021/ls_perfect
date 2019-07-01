import { Component, Injector, ViewEncapsulation } from '@angular/core';

import { BaseInfiniteGridViewModel } from 'life-core/component/grid';

import { PolicyProxy } from 'ls-core/model';

import { SummaryFilterModel } from 'business/home/summary/filter/summary-filter.model';
import { SummaryChannels } from 'business/home/summary/summary-channels';
import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { GridDataStateKeys } from 'business/shared/grid';

import { RecentlyAccessedCasesGridColumnsBuilder } from './recently-accessed-cases-grid-columns.builder';
import { RecentlyAccessedCasesGridDataSource } from './datasource/recently-accessed-cases-grid-datasource';

@Component({
    selector: 'recently-accessed-cases',
    templateUrl: './recently-accessed-cases.component.html',
    styleUrls: ['./recently-accessed-cases.component.css'],
    providers: [RecentlyAccessedCasesGridColumnsBuilder, RecentlyAccessedCasesGridDataSource],
    encapsulation: ViewEncapsulation.None
})
export class RecentlyAccessedCasesComponent extends BaseInfiniteGridViewModel<PolicyProxy> {
    private _openPolicyDelegate: OpenPolicyDelegate;

    constructor(
        injector: Injector,
        gridDataSource: RecentlyAccessedCasesGridDataSource,
        gridColumnsBuilder: RecentlyAccessedCasesGridColumnsBuilder,
        openPolicyDelegate: OpenPolicyDelegate
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this._openPolicyDelegate = openPolicyDelegate;
        this.filterModel = new SummaryFilterModel();
        this.setGridOptions();
        this.enableRowDetail = false;
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this.openSelectedGridRow();
    }

    protected openSelectedGridRow(): void {
        if (this.anyGridRowsSelected()) {
            this.updateGridRowsState();
            this._openPolicyDelegate.openPolicy(this.selectedGridRows[0]);
        }
    }

    protected registerFilterChangeHandlers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(SummaryChannels.UserTeamChange, (summaryFilterModel: SummaryFilterModel) =>
                this.onFilterModelReceived(summaryFilterModel)
            )
        );
    }

    protected getGridStateKey(): string {
        return GridDataStateKeys.RECENTLY_ACCESSED_CASES;
    }

    protected getHeaderRowsCount(): number {
        return 1;
    }

    protected rowDataMatch(rowData1: PolicyProxy, rowData2: PolicyProxy): boolean {
        return rowData1.PolicyId === rowData2.PolicyId;
    }

    private setGridOptions(): void {
        this.cacheBlockSize = 10;
        this.enableSorting = false;
    }
}
