export interface IDataGridCommonOptions {
    rowHeight?: number;
    gridClass?: string;
    // setting suppressPropertyNamesCheck property to true to avoid warning messages for custom properties
    // https://github.com/ag-grid/ag-grid/issues/2320
    suppressPropertyNamesCheck: boolean;
}

const GridClass = 'ag-theme-blue';

export const DataGridCommonOptions: IDataGridCommonOptions = {
    rowHeight: 30,
    gridClass: GridClass,
    suppressPropertyNamesCheck: true
};
