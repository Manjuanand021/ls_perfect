import { Component, Injector } from '@angular/core';

import { BaseDataManager, RowManagementDelegate, MasterDetailComponentResolver } from 'life-core/component/master-detail';
import { TestItem } from './test-item.model';
import { TestItemFactory } from './test-item-factory';
import { TestDetailEditor } from './test-detail-editor';
import { TestDialogDetailEditor } from './test-dialog-detail-editor';
import { TestMasterDetailInline } from './test-master-detail-inline';

export function popupItemComponentResolverFactory(): MasterDetailComponentResolver<any> {
    return new MasterDetailComponentResolver({
        itemComponents: TestDialogDetailEditor
    });
}

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
    selector: 'test-master-detail-popup',
    template: `
		<div class="row">
			<master-detail #md name="mdPopup" [gridOptions]="gridOptions" [buttons]="buttons" [title]="title" 
			secureComponent showDetailAsPopup="showDetailAsPopup" style="width: 800px;" 
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
            useFactory: popupItemComponentResolverFactory
        }
    ]
})
export class TestMasterDetailPopup extends TestMasterDetailInline {
    constructor(injector: Injector) {
        super(injector);
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getTitle(): string {
        return 'Test Master Detail (Popup)';
    }
}
