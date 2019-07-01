import { Component, Injector, Injectable } from '@angular/core';

import { DataGridRowNumber, BaseInfiniteGridViewModel } from 'life-core/component/grid';
import { ParentChildRegistry } from 'life-core/view-model';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyProxyDTO } from 'ls-core/model';

import { GridDataStateKeys } from 'business/shared/grid';
import { ReassignCaseGridColumnsBuilder } from '../grid/reassign-case-grid-columns.builder';
import { ReassignCaseGridDataSource } from '../data-source/reassign-case-grid-datasource';
import { ReassignCaseChannels } from '../reassign-case-channels';
import { ReassignCaseFilterModel } from '../filter/reassign-case-filter.model';

@Component({
    selector: 'reassign-case-grid',
    templateUrl: './reassign-case-grid.component.html',
    providers: [ParentChildRegistry, ReassignCaseGridColumnsBuilder, ReassignCaseGridDataSource, PolicySubscriber]
})
@Injectable()
export class ReassignCaseGridComponent extends BaseInfiniteGridViewModel<PolicyProxyDTO> {
    public selectedPolicies: PolicyProxyDTO[];

    constructor(
        injector: Injector,
        gridDataSource: ReassignCaseGridDataSource,
        gridColumnsBuilder: ReassignCaseGridColumnsBuilder
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this.filterModel = new ReassignCaseFilterModel();
        this.selectedPolicies = [];
    }

    public onRowSelected($event: any): void {
        if ($event.node.selected) {
            this.selectedPolicies.push($event.data);
        } else {
            const policyDeleteIndex = this.selectedPolicies.indexOf($event.data);
            this.selectedPolicies.splice(policyDeleteIndex, 1);
        }
        this.selectedGridRows = this.selectedPolicies;
        this.updateGridRowsState();
    }

    // no implementation needed
    protected openSelectedGridRow(): void {}

    protected showCheckboxColumn(): boolean {
        return true;
    }

    protected registerFilterChangeHandlers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(
                ReassignCaseChannels.ReassignFromChange,
                (reassignCaseFilter: ReassignCaseFilterModel) => this.onFilterModelReceived(reassignCaseFilter)
            )
        );
    }

    protected getGridStateKey(): string {
        return GridDataStateKeys.REASSIGN_CASE;
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }

    protected isGridRowSelected(policyProxy: PolicyProxyDTO): boolean {
        return !!(<PolicyProxyDTO[]>this.gridState.selectedRows).find(selectedGridRow =>
            this.rowDataMatch(selectedGridRow, policyProxy)
        );
    }

    protected rowDataMatch(rowData1: PolicyProxyDTO, rowData2: PolicyProxyDTO): boolean {
        return rowData1.PolicyId === rowData2.PolicyId;
    }
}
