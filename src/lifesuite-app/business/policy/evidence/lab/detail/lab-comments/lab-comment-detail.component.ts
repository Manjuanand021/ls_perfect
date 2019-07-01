import { Component, Injector, Input } from '@angular/core';
import { LabCommentDTO } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm.ts';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { LabCommentDetailGridColumnsBuilder } from './lab-comment-detail-grid-columns.builder';

@Component({
    selector: 'lab-comment-detail',
    templateUrl: './lab-comment-detail.component.html',
    providers: [PolicySubscriber, LabCommentDetailGridColumnsBuilder]
})
export class LabCommentDetailComponent extends BasePolicyGridViewModel<LabCommentDTO> {
    private _labCommentData: LabCommentDTO[];

    private _gridColumnsBuilder: LabCommentDetailGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: LabCommentDetailGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public get labCommentData(): LabCommentDTO[] {
        return this._labCommentData;
    }

    @Input()
    public set labCommentData(value: LabCommentDTO[]) {
        this._labCommentData = value;
        this.refreshGrid();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): LabCommentDTO[] {
        return this.labCommentData;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getRowNodeId(data: LabCommentDTO): Array<any> {
        return [data.RequirementInformationId, data.RemarkId, data.SequenceNo];
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Small;
    }
}
