import { GridOptions, ColDef, CellFocusedEvent, ColumnResizedEvent } from 'ag-grid-community';
import { IDataGridColumn } from 'life-core/component/grid';
import { IDataGridCommonOptions } from './data-grid-common-options';
import { NoRowsOverlayComponent } from '../overlay/no-rows-overlay.component';

export interface IDataGridOptions extends GridOptions {
    headerRows?: number;
    rows?: number;
    height?: string;
    gridClass?: string;
    showTotal?: boolean;
    checkboxColumn?: boolean;
    enableRowDetail?: boolean;
}

export class DataGridOptionsUtil {
    public static getGridOptions(options: IDataGridOptions, commonOptions: IDataGridCommonOptions): IDataGridOptions {
        const gridOptions = { ...options, ...commonOptions };
        if (gridOptions.headerRows) {
            this.setHeaderHeight(gridOptions);
        }
        if (!gridOptions.height) {
            this.setHeight(gridOptions);
        }
        this.setOverlayComponents(gridOptions);
        if (this.needToHandleColumnResize(gridOptions)) {
            this.addColumnResizedHandler(gridOptions);
        }
        if (gridOptions.checkboxColumn) {
            this.insertCheckboxColumn(gridOptions);
        }
        this.setRowSelection(gridOptions);
        return gridOptions;
    }

    private static setHeaderHeight(options: IDataGridOptions): void {
        options.headerHeight = options.headerRows * HEADER_ROW_HEIGHT;
    }

    private static setHeight(options: IDataGridOptions): void {
        const rows = options.rows || DataGridRowNumber.Medium;
        const height = rows * options.rowHeight + (options.headerHeight || HEADER_ROW_HEIGHT);
        options.height = `${height}px`;
    }

    private static setOverlayComponents(options: IDataGridOptions): void {
        options.frameworkComponents = options.frameworkComponents || {};
        this.setNoRowsOverlayComponent(options);
        // this.setLoadingOverlayComponent();
    }

    protected static setNoRowsOverlayComponent(options: IDataGridOptions): void {
        options.frameworkComponents[DataGridCustomOptions.NoRowsOverlay] = NoRowsOverlayComponent;
        options.noRowsOverlayComponent = DataGridCustomOptions.NoRowsOverlay;
    }

    private static needToHandleColumnResize(options: IDataGridOptions): boolean {
        const hasAutoHeight = options.columnDefs.findIndex(colDef => (colDef as ColDef).autoHeight == true) >= 0;
        return options.enableColResize && hasAutoHeight;
    }

    private static addColumnResizedHandler(options: IDataGridOptions): void {
        options.onColumnResized = (event: ColumnResizedEvent) => {
            if (event.finished && event.column.getColDef().autoHeight) {
                options.api.resetRowHeights();
            }
        };
    }

    private static insertCheckboxColumn(options: IDataGridOptions): void {
        const checkboxColumn: IDataGridColumn = {
            headerName: '',
            width: 50,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            headerClass: 'lf-grid-checkbox-header-cell',
            cellClass: 'lf-grid-checkbox-column-cell',
            suppressFilter: true
        };
        options.columnDefs.splice(0, 0, checkboxColumn);
    }

    private static setRowSelection(options: IDataGridOptions): void {
        const isMultiSelection = options.rowSelection == 'multiple';
        if (!isMultiSelection) {
            options.onCellFocused = (event: CellFocusedEvent) => {
                options.api.forEachNode(node => {
                    if (node.rowIndex == event.rowIndex) {
                        node.setSelected(true, true);
                    }
                });
            };
        }
    }
}

export const HEADER_ROW_HEIGHT = 25;

export const DataGridRowNumber = {
    Small: 4,
    Medium: 10,
    Large: 25,
    ExtraLarge: 50
};

export const DataGridCustomOptions = {
    NoRowsOverlay: 'customNoRowsOverlay'
};
