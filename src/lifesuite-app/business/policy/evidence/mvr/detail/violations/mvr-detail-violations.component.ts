import { Injector, Component, Input } from '@angular/core';

import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm';
import {
    IGridColumnsBuilder,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { MVRDetailDTO } from 'ls-core/model';

import { MVRDetailViolationsGridColumnsBuilder } from './mvr-detail-violations-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';

@Component({
    selector: 'mvr-detail-violations',
    templateUrl: './mvr-detail-violations.component.html',
    providers: [PolicySubscriber, MVRDetailViolationsGridColumnsBuilder]
})
export class MVRDetailViolationsComponent extends BasePolicyGridViewModel<MVRDetailDTO> {
    public gridOptions: IDataGridOptions;
    private _gridColumnsBuilder: MVRDetailViolationsGridColumnsBuilder;
    private _violationData: MVRDetailDTO[];

    constructor(injector: Injector, gridColumnsBuilder: MVRDetailViolationsGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    @Input()
    public set violationData(value: MVRDetailDTO[]) {
        this._violationData = value;
        this.refreshGrid();
    }

    public getGridOptions(): IDataGridOptions {
        const gridColumns: DataGridColumns = this.getGridColumns();
        return DataGridOptionsUtil.getGridOptions(
            {
                rowData: this.loadItems(),
                columnDefs: gridColumns.getLayout(),
                rowSelection: 'single',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                headerRows: 2,
                context: {
                    hostComponent: this
                }
            },
            DataGridCommonOptions
        );
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): MVRDetailDTO[] {
        return this._violationData;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getRowNodeId(data: MVRDetailDTO): Object {
        return data.MvrHeaderId;
    }
}
