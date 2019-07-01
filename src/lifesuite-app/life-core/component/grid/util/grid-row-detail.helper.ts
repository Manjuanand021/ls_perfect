import { Injectable } from '@angular/core';
import { ColDef, RowNode, Column } from 'ag-grid-community';

import { ModalDialog, DialogButton, DialogButtonType, DialogSize } from 'life-core/component/dialog';
import { IDataGridColumn } from 'life-core/component/grid';
import { GridRowDetailComponent, GridRowDetailModel, GridRowDetailFieldModel } from '../row-detail';
import { IDataGridOptions } from '../options';

@Injectable({
    providedIn: 'root'
})
export class GridRowDetailHelper {
    private _modalDialog: ModalDialog;

    constructor(modalDialog: ModalDialog) {
        this._modalDialog = modalDialog;
    }

    public openRowDetailDialog(gridOption: IDataGridOptions, node: RowNode): void {
        this._modalDialog.open({
            view: GridRowDetailComponent,
            title: '',
            data: this.getRowDetailMessage(gridOption, node),
            buttons: [new DialogButton({ type: DialogButtonType.OK, options: { isDefault: true } })]
        });
    }

    private getRowDetailMessage(gridOption: IDataGridOptions, node: RowNode): GridRowDetailModel {
        const rowDetail = new GridRowDetailModel();
        let fieldDetail: GridRowDetailFieldModel;
        const gridColumns = gridOption.columnApi.getAllDisplayedColumns();

        for (let i = 0, length = gridColumns.length; i < length; i++) {
            if (this.needToAddColumn(gridColumns[i])) {
                fieldDetail = this.getFieldDetail(gridOption, node, gridColumns[i]);
                rowDetail.fields.push(fieldDetail);
            }
        }
        return rowDetail;
    }

    private needToAddColumn(column: Column): boolean {
        return !column.getColDef().cellRenderer;
    }

    private getFieldDetail(gridOption: IDataGridOptions, node: RowNode, column: Column): GridRowDetailFieldModel {
        const fieldDetail = new GridRowDetailFieldModel();
        fieldDetail.fieldHeader = this.getColumnHeader(column);
        fieldDetail.fieldValue = this.getDisplayedFieldValue(gridOption, node, column);
        return fieldDetail;
    }

    private getColumnHeader(column: Column): string {
        const colDef = column.getColDef();
        return colDef.headerName;
    }

    private getDisplayedFieldValue(gridOption: IDataGridOptions, node: RowNode, column: Column): string {
        const columnDef: IDataGridColumn = column.getColDef();
        const fieldName: string = columnDef.field;
        const displayedFieldValue = columnDef.valueFormatter
            ? this.getFormattedFieldValue(gridOption, node, column)
            : node.data[fieldName];
        return displayedFieldValue == null ? '' : displayedFieldValue.toString();
    }

    private getFormattedFieldValue(gridOption: IDataGridOptions, node: RowNode, column: Column): string {
        const columnDef: IDataGridColumn = column.getColDef();
        const fieldName = columnDef.field;
        return columnDef.valueFormatter({
            value: node.data[fieldName],
            node: node,
            data: node.data,
            colDef: columnDef,
            column: column,
            api: gridOption.api,
            columnApi: gridOption.columnApi,
            context: gridOption.context
        });
    }
}
