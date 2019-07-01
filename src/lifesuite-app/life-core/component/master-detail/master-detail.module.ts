import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComposeModule } from 'life-core/component/compose/compose.module';
import { DataGridModule } from 'life-core/component/grid/data-grid.module';
import { DataGridStatusBarModule } from 'life-core/component/grid/status-bar/data-grid-status-bar.module';
import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { LfDialogModule, LF_DIALOG_EXPORTS } from 'life-core/component/dialog/dialog.module';
import { MasterDetail } from './master-detail';
import { Detail } from './detail/detail';
import { Master } from './master/master';
import { MasterDetailNotification, LfMasterDetailNotification } from './notification/master-detail-notification';

export const MASTERDETAIL_EXPORTS: Array<any> = [MasterDetail, Master, Detail];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComposeModule,
        DataGridStatusBarModule,
        DataGridModule,
        LfButtonModule,
        LfDialogModule
    ],
    declarations: [MasterDetail, Master, Detail],
    exports: [...MASTERDETAIL_EXPORTS, ...LF_BUTTON_EXPORTS, ...LF_DIALOG_EXPORTS],
    providers: [{ provide: MasterDetailNotification, useClass: LfMasterDetailNotification }]
})
export class MasterDetailModule {}
