import { IDataGridOptions, DataGridColumns, GridState } from 'life-core/component/grid';

export interface IDataGridViewModel {
    gridOptions: IDataGridOptions;

    getGridOptions(): IDataGridOptions;

    getGridColumns(): DataGridColumns;
}

export interface IDataSourceContext {
    onGetRowsComplete({
        gridState,
        rows,
        rowCount
    }: {
        gridState: GridState;
        rows: Array<any>;
        rowCount: number;
    }): void;
}

export interface IDataGridContext {
    hostComponent: IDataSourceContext;
}
