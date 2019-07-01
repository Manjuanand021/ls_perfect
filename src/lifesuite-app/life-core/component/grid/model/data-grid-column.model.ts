import { ColDef } from 'ag-grid-community';

export interface IDataGridColumn extends ColDef {}

export class DataGridColumns {
    private _columns: Array<IDataGridColumn>;

    constructor() {
        this._columns = [];
    }

    public add(column: IDataGridColumn): void {
        this._columns.push(column);
    }

    public item(index: number): IDataGridColumn {
        return this._columns[index];
    }

    public remove(field: string): void {
        const columnIndex: number = this.itemIndexByField(field);
        if (columnIndex >= 0) {
            this._columns.splice(columnIndex, 1);
        }
    }

    public removeAll(): void {
        this._columns = [];
    }

    public length(): number {
        return this._columns.length;
    }

    public itemByField(field: string): IDataGridColumn {
        return this._columns.find(column => {
            return column.field == field;
        });
    }

    public itemIndexByField(field: string): number {
        return this._columns.findIndex(column => {
            return column.field == field;
        });
    }

    public getLayout(): Array<IDataGridColumn> {
        return this._columns;
    }
}
