import { GridApi } from 'ag-grid-community';

export class DataSourceUtil {
    public static onGetRowsComplete = (rows: any[], gridApi: GridApi) => {
        gridApi.sizeColumnsToFit();
        rows.length == 0 ? gridApi.showNoRowsOverlay() : gridApi.hideOverlay();
    };
}
