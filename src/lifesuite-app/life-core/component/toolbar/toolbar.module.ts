import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { LfDialogModule } from 'life-core/component/dialog/dialog.module';

import { LfToolbar } from './toolbar';
import { ToolBarButtonFactory } from './toolbar-button-factory';

export const TOOLBAR_EXPORTS: Array<any> = [LfToolbar];

@NgModule({
    imports: [CommonModule, LfButtonModule, LfDialogModule],
    declarations: [LfToolbar],
    providers: [ToolBarButtonFactory],
    exports: [...TOOLBAR_EXPORTS, ...LF_BUTTON_EXPORTS]
})
export class ToolbarModule {}
