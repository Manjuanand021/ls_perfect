import { Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import {
    IDataGridOptions,
    DataGridOptionsUtil,
    DataGridRowNumber,
    HEADER_ROW_HEIGHT
} from 'life-core/component/grid/options/data-grid-options';
import { IGridColumnsBuilder } from 'life-core/component/grid/builder/base-grid-columns.builder';
import { DataGridColumns } from 'life-core/component/grid/model/data-grid-column.model';
import { DataGridCommonOptions } from 'life-core/component/grid/options';
import { KeyBoardUtil } from 'life-core/util';

import { IDataGridViewModel } from './data-grid-vm.interface';
import { GridRowDetailHelper } from '../util/grid-row-detail.helper';
import { RowNode } from 'ag-grid-community';

export abstract class BaseGridViewModel<T> extends ViewModel implements IDataGridViewModel {
    public gridOptions: IDataGridOptions;
    public title: string;
    public rowCount: number = 0;
    protected enableSorting: boolean;
    protected enableRowDetail: boolean = true;
    private _gridRowDetailHelper: GridRowDetailHelper;

    constructor(injector: Injector) {
        super(injector);
        this._gridRowDetailHelper = injector.get(GridRowDetailHelper);
        this.enableSorting = true;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.gridOptions = this.getGridOptions();
        this.title = this.setGridTitle();
        this.setRowCount(this.gridOptions.rowData.length);
        return Promise.resolve();
    }

    public getGridOptions(): IDataGridOptions {
        const items = this.loadItems();
        const gridColumns = this.getGridColumns();
        const rowSelection = this.getRowSelectionType();
        const gridOptions = DataGridOptionsUtil.getGridOptions(
            {
                rowData: items,
                rowSelection: rowSelection,
                columnDefs: gridColumns.getLayout(),
                enableColResize: true,
                checkboxColumn: this.showCheckboxColumn(),
                // deltaRowDataMode: true, // for some reason this doesn't work
                getRowNodeId: this.getRowNodeId,
                rows: this.getGridMinRows(),
                context: this,
                enableSorting: this.enableSorting,
                enableRowDetail: this.enableRowDetail
            },
            DataGridCommonOptions
        );
        this.setGridHeight(gridOptions);
        return gridOptions;
    }

    protected showCheckboxColumn(): boolean {
        return false;
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build();
    }

    public onRowClicked($event: any): void {
        if (KeyBoardUtil.isCtrlClick($event.event)) {
            this.onCtrlClick($event.node);
        }
    }

    protected onCtrlClick(rowNode: RowNode): void {
        if (this.enableRowDetail) {
            this._gridRowDetailHelper.openRowDetailDialog(this.gridOptions, rowNode);
        }
    }

    public getRowSelectionType(): string {
        return this.showCheckboxColumn() ? 'multiple' : 'single';
    }

    protected abstract getGridColumnsBuilder(): IGridColumnsBuilder;

    protected abstract loadItems(): T[];

    protected abstract setGridTitle(): string;

    protected abstract getRowNodeId(data: T): any;

    public refreshGrid(): void {
        if (this.gridOptions && this.gridOptions.api) {
            const items = this.loadItems();
            this.gridOptions.api.setRowData(items);
            this.gridOptions.rowData = items;
            this.setRowCount(items.length);
            this.setGridHeight(this.gridOptions);
        }
    }

    public setGridHeight(gridOptions: IDataGridOptions): void {
        gridOptions.height = `${this.calculateGridHeight(gridOptions)}px`;
    }

    protected setRowCount(value: number): void {
        this.rowCount = value;
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Small;
    }

    private calculateGridHeight(gridOptions: IDataGridOptions): number {
        const maxVisibleRows = gridOptions.rows;
        // Set number of visible rows between [maxVisibleRows/2 : maxVisibleRows],
        // depending on actual number of rows.
        const rows = Math.max(Math.min(gridOptions.rowData.length, maxVisibleRows), Math.ceil(maxVisibleRows / 2));
        const rowsHeight = rows * gridOptions.rowHeight;
        const headerHeight = gridOptions.headerHeight || HEADER_ROW_HEIGHT;
        return rowsHeight + headerHeight;
    }
}
