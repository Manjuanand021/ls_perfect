import { Component, Injector, ViewChild } from '@angular/core';

import {
    MasterDetailViewModel,
    MasterDetail,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver
} from 'life-core/component/master-detail';
import {
    IDataGridOptions,
    IGridColumnsBuilder,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { TestItem } from './test-item.model';
import { TestGridColumnsBuilder } from './test-grid-columns.builder';
import { TestItemFactory } from './test-item-factory';
import { TestDetailEditor } from './test-detail-editor';
import { Countries } from './test-data';

export function rowManagementDelegateFactory(
    itemFactory: TestItemFactory,
    dataManager: BaseDataManager<TestItem>
): RowManagementDelegate<TestItem> {
    return new RowManagementDelegate({
        itemName: 'Test',
        itemIDPropertyName: 'id',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<any> {
    return new MasterDetailComponentResolver({
        itemComponents: TestDetailEditor
    });
}

@Component({
    selector: 'test-master-detail-inline',
    template: `
		<div class="row">
			<master-detail #md name="mdInline"[gridOptions]="gridOptions" [buttons]="buttons" [title]="title" 
				secureComponent style="width: 800px;" 
			>
			</master-detail>
		</div>
	`,
    providers: [
        BaseDataManager,
        TestItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [TestItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        }
    ]
})
export class TestMasterDetailInline extends MasterDetailViewModel<TestItem> {
    protected gridData: TestItem[];

    public columnsBuilder: IGridColumnsBuilder;

    private _confirmDialog: ConfirmDialog;

    @ViewChild(MasterDetail)
    refMasterDetail: MasterDetail<TestItem>;

    constructor(injector: Injector) {
        super(injector);
        this.columnsBuilder = injector.get(TestGridColumnsBuilder);
        this._confirmDialog = injector.get(ConfirmDialog);
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    protected getTitle(): string {
        return 'Test Master Detail (Inline)';
    }

    protected loadItems(): TestItem[] {
        this.generateData();
        return this.gridData;
    }

    generateData() {
        // generate some random data
        this.gridData = [];
        for (var i = 0; i < 100; i++) {
            this.gridData.push({
                id: i + 1,
                country: (i % Countries.length) + 1,
                downloads: Math.round(Math.random() * 20000),
                sales: Math.floor(Math.random() * 1000000) / 100,
                date: new Date('07/15/2012')
            });
        }
    }

    public getGridColumns(): DataGridColumns {
        return this.columnsBuilder.build();
    }

    public getGridOptions(): IDataGridOptions {
        let gridColumns: DataGridColumns = this.getGridColumns();

        return DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: gridColumns.getLayout(),
                rowSelection: 'single',
                enableColResize: true,
                deltaRowDataMode: true,
                pagination: true,
                paginationAutoPageSize: true,
                getRowNodeId: function(data) {
                    return data.id;
                }
            },
            DataGridCommonOptions
        );
    }

    protected removeItem(item: TestItem): Promise<boolean> {
        return this._confirmDialog
            .open({
                message: `Do you want to delete item ${item.id}?`,
                title: 'Delete Item',
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                let isRemoved = result.buttonId == DialogButtonType.OK;
                if (isRemoved) {
                    this.rowManagementDelegate.deleteRow(item);
                }
                return isRemoved;
            });
    }

    protected getMasterDetail(): MasterDetail<TestItem> {
        return this.refMasterDetail;
    }

    protected isDialogButtonTypeOK(buttonType: string): boolean {
        return buttonType == DialogButtonType.OK;
    }
}
