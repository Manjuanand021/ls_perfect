import { Injector, Input, ViewChild } from '@angular/core';

import { MasterDetailViewModel, MasterDetail } from 'life-core/component/master-detail';
import {
    IDataGridOptions,
    IGridColumnsBuilder,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridRowNumber,
    DataGridCommonOptions,
    IDataGridColumn
} from 'life-core/component/grid';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';

export abstract class BasePolicyMasterDetailViewModel<T> extends MasterDetailViewModel<T> {
    @ViewChild(MasterDetail)
    private refMasterDetail: MasterDetail<T>;

    @Input()
    public disabled: boolean;

    protected confirmDialog: ConfirmDialog;
    protected enableSorting: boolean;
    protected enableRowDetail: boolean = true;

    constructor(injector: Injector) {
        super(injector);
        this.confirmDialog = injector.get(ConfirmDialog);
        this.enableSorting = true;
    }

    protected abstract getGridColumnsBuilder(): IGridColumnsBuilder;

    public getGridOptions(): IDataGridOptions {
        return DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: this.getGridColumnDefs(),
                rowSelection: 'single',
                enableColResize: true,
                deltaRowDataMode: true,
                headerRows: this.numHeaderRows,
                getRowNodeId: this.getRowNodeId,
                rows: this.getGridMinRows(),
                context: this,
                enableSorting: this.enableSorting,
                enableRowDetail: this.enableRowDetail
            },
            DataGridCommonOptions
        );
    }

    protected getGridColumnDefs(): IDataGridColumn[] {
        const gridColumns: DataGridColumns = this.getGridColumnsBuilder().build();
        return gridColumns.getLayout();
    }

    protected get numHeaderRows(): number {
        return NUMBER_OF_HEADER_ROWS_IN_GRID;
    }

    protected abstract getRowNodeId(data: T): any;

    protected getGridMinRows(): number {
        return this.showDetailAsPopup ? DataGridRowNumber.Small : DataGridRowNumber.Medium;
    }

    protected getItemDetailDialogButtons(): DialogButton[] {
        return [
            new DialogButton({ type: DialogButtonType.ACCEPT }),
            new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
        ];
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.selectDefaultRow();
    }

    protected selectDefaultRow(): void {
        if (!this.showDetailAsPopup) {
            setTimeout(() => {
                this.selectFirstRow();
            });
        }
    }

    protected selectFirstRow(): void {
        if (this.items.length > 0) {
            this.setActiveItem(this.items[0]);
        }
    }

    protected removeItem(item: T): Promise<boolean> {
        return this.confirmDialog
            .open({
                message: this.getRemoveItemMessage(item),
                title: this.getDeleteItemDialogTitle(),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                const isRemoved = result.buttonId == DialogButtonType.OK;
                if (isRemoved) {
                    this.rowManagementDelegate.deleteRow(item);
                }
                return isRemoved;
            });
    }

    protected getMasterDetail(): MasterDetail<T> {
        return this.refMasterDetail;
    }

    protected isDialogButtonTypeOK(buttonType: string): boolean {
        return buttonType === DialogButtonType.OK || buttonType === DialogButtonType.ACCEPT;
    }
}

const NUMBER_OF_HEADER_ROWS_IN_GRID = 1;
