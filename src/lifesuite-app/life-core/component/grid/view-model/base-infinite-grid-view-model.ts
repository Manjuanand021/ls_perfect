import { Injector, ViewChild } from '@angular/core';
import { RowNode, GridReadyEvent } from 'ag-grid-community';

import { AuthorizationLevel } from 'life-core/authorization';
import { ViewModel } from 'life-core/view-model/view-model';
import { IDataGridViewModel, IDataSourceContext } from 'life-core/component/grid/view-model/data-grid-vm.interface';
import {
    IDataGridOptions,
    DataGridOptionsUtil,
    DataGridRowNumber
} from 'life-core/component/grid/options/data-grid-options';
import { DataGrid } from 'life-core/component/grid/data-grid';
import { IGridColumnsBuilder } from 'life-core/component/grid/builder/base-grid-columns.builder';
import { GridFilterFrameworkComponents } from 'life-core/component/grid/filter';
import { DataGridColumns, IDataGridColumn } from 'life-core/component/grid/model/data-grid-column.model';
import { DataSourceUtil } from 'life-core/component/grid/data-source';
import { MessagingService, IMessagingService } from 'life-core/messaging';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { DataGridCommonOptions } from 'life-core/component/grid/options';
import { TabStateValueAccessor, TabStateManager, KeyBoardUtil } from 'life-core/util';
import { GridState } from 'life-core/component/grid';

import { IInfiniteGridDatasource } from './infinite-grid-datasource.interface';
import { GridRowDetailHelper } from '../util/grid-row-detail.helper';

const DEFAULT_HEADER_ROWS = 2;

export abstract class BaseInfiniteGridViewModel<T> extends ViewModel implements IDataGridViewModel, IDataSourceContext {
    public gridOptions: IDataGridOptions;
    public title: string;
    public rowCount: number = 0;
    public filterModel: any;

    protected messagingService: IMessagingService;
    protected confirmDialog: ConfirmDialog;
    protected enableSorting: boolean;
    protected enableRowDetail: boolean = true;
    protected cacheBlockSize: number;
    protected gridStateValueAccessor: TabStateValueAccessor<GridState<T>>;
    protected enableFilter: boolean;
    protected selectedGridRows: T[] = [];
    protected gridState: GridState<T>;

    @ViewChild(DataGrid)
    private _refDataGrid: DataGrid;
    private _gridDataSource: IInfiniteGridDatasource;
    private _gridColumns: DataGridColumns;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _gridRowDetailHelper: GridRowDetailHelper;

    constructor(injector: Injector, gridDataSource: IInfiniteGridDatasource, gridColumnsBuilder: IGridColumnsBuilder) {
        super(injector);
        this.messagingService = injector.get(MessagingService);
        this.confirmDialog = injector.get(ConfirmDialog);
        this._gridDataSource = gridDataSource;
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._gridRowDetailHelper = injector.get(GridRowDetailHelper);
        this.enableSorting = true;
        this.cacheBlockSize = 50;
        this.createGridStateValueAccessors(injector.get(TabStateManager));
        this.enableFilter = true;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.restoreGridState();
        this.gridOptions = this.getGridOptions();
        this.bindGridReady();
        return Promise.resolve();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.registerFilterChangeHandlers();
    }

    public getGridOptions(): IDataGridOptions {
        this.setGridColumns();
        this.setColumnSortOrder();
        const gridOptions = DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: this._gridColumns.getLayout(),
                rowModelType: 'infinite',
                cacheBlockSize: this.cacheBlockSize, // fetch 50 rows at a time (~200K)
                maxBlocksInCache: 10, // keep maximum 500 rows in cache (~2000K)
                enableServerSideSorting: true,
                rowSelection: this.getRowSelectionType(),
                checkboxColumn: this.showCheckboxColumn(),
                rowDeselection: true,
                enableColResize: true,
                maxConcurrentDatasourceRequests: 2,
                enableFilter: this.enableFilter,
                frameworkComponents: GridFilterFrameworkComponents,
                enableSorting: this.enableSorting,
                enableRowDetail: this.enableRowDetail,
                headerRows: this.getHeaderRowsCount(),
                rowData: [],
                rows: this.getGridMinRows(),
                context: {
                    hostComponent: this
                }
            },
            DataGridCommonOptions
        );
        return gridOptions;
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build();
    }

    public onRowClicked($event: any): void {
        this.selectedGridRows = [$event.node.data];
        this.onSelectedGridRowsChange();
        if (KeyBoardUtil.isCtrlClick($event.event)) {
            this.onCtrlClick($event.node);
        }
    }

    protected onCtrlClick(rowNode: RowNode): void {
        if (this.enableRowDetail) {
            this._gridRowDetailHelper.openRowDetailDialog(this.gridOptions, rowNode);
        }
    }

    public onRowDoubleClicked($event: any): void {
        this.selectedGridRows = [$event.node.data];
        this.openSelectedGridRow();
    }

    public onGetRowsComplete({
        gridState,
        rows,
        rowCount
    }: {
        gridState: GridState<T>;
        rows: Array<T>;
        rowCount: number;
    }): void {
        DataSourceUtil.onGetRowsComplete(rows, this.gridOptions.api);
        this.setRowCount(rowCount);
        this.setGridState({
            ...this.gridState,
            sortModel: gridState.sortModel,
            filterModel: gridState.filterModel
        });
        this.setupDataOnRowsReceived(rows);
    }

    public onFilterChange(): void {
        this.onFilterModelReceived();
    }

    public getRowSelectionType(): string {
        return this.showCheckboxColumn() ? 'multiple' : 'single';
    }

    protected onFilterModelReceived(
        filterModel?: any,
        rebuildColumns: boolean = false,
        resetFilters: boolean = false
    ): void {
        if (rebuildColumns) {
            this.rebuildGridColumnsWihSortOrder(resetFilters);
        }
        this.updateFilter(filterModel);
        this.scaleGridColumnsToFitWidth();
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Large;
    }

    protected updateFilterModel(filterModel: any): void {
        this.filterModel = filterModel ? filterModel : this.filterModel;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected showNoRowSelectedDialog(message: string, title: string): void {
        this.confirmDialog.open({
            message: message,
            title: title,
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    protected updateFilter(filterModel?: any): void {
        if (this.gridOptions && this.gridOptions.api) {
            this.updateFilterModel(filterModel);
            this._gridDataSource.updateFilter(this.filterModel);
            this.gridOptions.api.setDatasource(this._gridDataSource);
        }
    }

    protected showCheckboxColumn(): boolean {
        return false;
    }

    protected getHeaderRowsCount(): number {
        return DEFAULT_HEADER_ROWS;
    }

    protected setupDataOnRowsReceived(rows: Array<T>): void {
        this.resetSelectedGridRow();
        this.setSelectedGridRows();
        this.onSelectedGridRowsChange();
    }

    protected isGridRowSelected(gridRow: T): boolean {
        const selectedGridRow = <T>this.gridState.selectedRows[0];
        return this.rowDataMatch(selectedGridRow, gridRow);
    }

    protected abstract rowDataMatch(rowData1: T, rowData2: T): boolean;

    protected abstract registerFilterChangeHandlers(): void;

    protected abstract getGridStateKey(): string;

    protected abstract openSelectedGridRow(): void;

    protected onSelectedGridRowsChange(): void {}

    protected setGridTitle(): string {
        return '';
    }

    protected rebuildGridColumnsWihSortOrder(resetFilters: boolean = false): void {
        this.setGridColumns();
        // to avoid loosing column sort order after rebuilding columns
        if (!resetFilters) {
            this.restoreGridState();
        }
        // retain default sort order on filter change.
        if (this.retainSortOrder()) {
            this.setColumnSortOrder();
        }
        this.rebuildGrid();
    }

    protected retainSortOrder(): boolean {
        return true;
    }

    protected rebuildGrid(): void {
        this._refDataGrid.rebuildGrid(this._gridColumns.getLayout());
    }

    protected setGridColumns(): void {
        this._gridColumns = this.getGridColumns();
    }

    protected setColumnSortOrder(): void {
        if (this.sortModelExist()) {
            if (this.sortOrderDefined()) {
                this.clearColumnSortOrder();
            }

            this.gridState.sortModel.forEach(sortModel => {
                const column: IDataGridColumn = this._gridColumns.itemByField(sortModel.colId);
                if (column) {
                    column.sort = sortModel.sort;
                }
            });
        }
    }

    protected setColumnFilters(): void {
        if (this.filterModelExist()) {
            for (const filter in this.gridState.filterModel) {
                const filterComponent = this.gridOptions.api.getFilterInstance(filter);
                filterComponent.setModel(this.gridState.filterModel[filter]);
            }
            this.gridOptions.api.onFilterChanged();
        }
    }

    protected updateGridRowsState(): void {
        this.setGridState({
            ...this.gridState,
            selectedRows: this.selectedGridRows
        });
    }

    protected setGridState(gridState: GridState<T>): void {
        this.gridState = gridState;
        this.gridStateValueAccessor.setValue(gridState);
    }

    protected restoreGridState(): void {
        if (this.gridStateValueAccessor.hasValue()) {
            this.gridState = this.gridStateValueAccessor.getValue();
        }
    }

    protected anyGridRowsSelected(): boolean {
        return this.selectedGridRows.length > 0;
    }

    private setSelectedGridRows(): void {
        if (this.selectedGridRowsStateExist()) {
            this.resetSelectedGridRow();
            this.gridOptions.api.forEachNode(node => {
                if (this.isGridRowSelected(node.data)) {
                    node.setSelected(true);
                    this.selectedGridRows = [node.data];
                }
            });
        }
    }

    private selectedGridRowsStateExist(): boolean {
        return this.gridState && this.gridState.selectedRows && this.gridState.selectedRows.length > 0;
    }

    private resetSelectedGridRow(): void {
        this.selectedGridRows = [];
    }

    private scaleGridColumnsToFitWidth(): void {
        this._refDataGrid.api.sizeColumnsToFit();
    }

    private setRowCount(value: number): void {
        this.rowCount = value;
    }

    private createGridStateValueAccessors(gridStateManager: TabStateManager): void {
        this.gridStateValueAccessor = new TabStateValueAccessor<GridState<T>>(gridStateManager, this.getGridStateKey());
    }

    private sortModelExist(): boolean {
        return this.gridState && this.gridState.sortModel && this.gridState.sortModel.length > 0;
    }

    private filterModelExist(): boolean {
        return this.gridState && this.gridState.filterModel;
    }

    // returns true if any of the column has sort order defined
    private sortOrderDefined(): boolean {
        return this._gridColumns.getLayout().some(item => !!item.sort);
    }

    private clearColumnSortOrder(): void {
        this._gridColumns.getLayout().forEach(column => {
            if (column.sort) {
                column.sort = undefined;
            }
        });
    }

    private bindGridReady(): void {
        this.gridOptions.onGridReady = (event: GridReadyEvent) => {
            this.setColumnFilters();
        };
    }
}
