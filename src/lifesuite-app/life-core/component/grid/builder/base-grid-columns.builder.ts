import { I18n } from 'life-core/i18n';
import { IDataGridColumn, DataGridColumns } from '../model/data-grid-column.model';

export interface IGridColumnsBuilder {
    build(...params: any[]): DataGridColumns;
    addColumn(column: IDataGridColumn): void;
}

export abstract class BaseGridColumnsBuilder implements IGridColumnsBuilder {
    protected columns: DataGridColumns;
    protected i18n: I18n;

    constructor() {
        this.columns = new DataGridColumns();
    }

    public abstract build(...params: any[]): DataGridColumns;

    public addColumn(column: IDataGridColumn): void {
        this.adjustColumnProperties(column);
        this.columns.add(column);
    }

    public resetColumns(): void {
        this.columns.removeAll();
    }

    private adjustColumnProperties(column: IDataGridColumn): void {
        if (column.filter) {
            if (!column.menuTabs) {
                column.menuTabs = ['filterMenuTab'];
            }
        }
        if (column.autoHeight) {
            column.cellClass = 'cell-wrap-text';
        }
    }
}
