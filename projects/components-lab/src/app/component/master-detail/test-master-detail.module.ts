import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { MasterButtonLabels } from 'life-core/component/master-detail';

import { TestMasterDetail } from './test-master-detail';
import { TestMasterDetailInline } from './test-master-detail-inline';
import { TestMasterDetailPopup } from './test-master-detail-popup';
import { TestDetailEditor } from './test-detail-editor';
import { TestDialogDetailCreator } from './test-dialog-detail-creator';
import { TestDialogDetailEditor } from './test-dialog-detail-editor';
import { TestGridColumnsBuilder } from './test-grid-columns.builder';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [
        TestMasterDetail,
        TestMasterDetailInline,
        TestMasterDetailPopup,
        TestDetailEditor,
        TestDialogDetailCreator,
        TestDialogDetailEditor
    ],
    exports: [TestMasterDetail, TestMasterDetailInline, TestMasterDetailPopup],
    entryComponents: [TestDetailEditor, TestDialogDetailCreator, TestDialogDetailEditor],
    providers: [TestGridColumnsBuilder, MasterButtonLabels]
})
export class TestMasterDetailModule {}
