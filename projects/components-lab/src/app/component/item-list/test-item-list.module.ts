import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';

import {
    TestItemLists,
    TestItemList,
    TestItemListEditMode,
    ItemA,
    ItemAEditor,
    ItemB,
    ItemBEditor
} from '../item-list';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [TestItemLists, TestItemList, TestItemListEditMode, ItemA, ItemAEditor, ItemB, ItemBEditor],
    entryComponents: [
        // Components loaded dynamically (not via Router)
        ItemA,
        ItemAEditor,
        ItemB,
        ItemBEditor
    ]
})
export class TestItemListModule {}
