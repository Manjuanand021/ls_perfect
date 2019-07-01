import { Component, Injector, Input } from '@angular/core';

import { EvidenceStatusDTO, MetadataItem } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm.ts';
import { IGridColumnsBuilder, DataGridRowNumber, DataGridColumns } from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { EvidenceStatusListGridColumnsBuilder } from './evidence-status-list-grid-columns.builder';

@Component({
    selector: 'evidence-status-list',
    templateUrl: './evidence-status-list.component.html',
    providers: [PolicySubscriber, EvidenceStatusListGridColumnsBuilder]
})
export class EvidenceStatusListComponent extends BasePolicyGridViewModel<EvidenceStatusDTO> {
    @Input() public ausUsers: MetadataItem[];

    private _evidenceStatusData: EvidenceStatusDTO[];

    private _gridColumnsBuilder: EvidenceStatusListGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: EvidenceStatusListGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    public get evidenceStatusListData(): EvidenceStatusDTO[] {
        return this._evidenceStatusData;
    }

    @Input()
    public set evidenceStatusListData(value: EvidenceStatusDTO[]) {
        this._evidenceStatusData = value;
        this.refreshGrid();
    }

    protected loadItems(): Array<EvidenceStatusDTO> {
        return this.evidenceStatusListData;
    }

    protected setGridTitle(): string {
        return 'Requirement History';
    }

    protected getRowNodeId(data: EvidenceStatusDTO): any {
        return data.RequirementInformationId;
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }
}
