export class GridState<TRowData = any> {
    public sortModel: any;
    public filterModel: any;
    public selectedRows: TRowData[];
    constructor({
        sortModel,
        filterModel,
        selectedRows
    }: {
        sortModel: any;
        filterModel: any;
        selectedRows?: TRowData[];
    }) {
        this.sortModel = sortModel;
        this.filterModel = filterModel;
        this.selectedRows = selectedRows;
    }
}
