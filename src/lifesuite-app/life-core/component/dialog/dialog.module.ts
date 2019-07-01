import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComposeModule } from 'life-core/component/compose/compose.module';
import { LfButtonModule } from 'life-core/component/button/lf-button.module';
import { ModalDialogWindow } from './modal/modal-dialog-window';
import { CardDialog } from './card/card-dialog';
import { ConfirmDialogContent } from './confirm/confirm-dialog';
import { PopoverDialog, PopoverConfig } from './popover/popover-dialog';
import { PopoverDialogWindow } from './popover/popover-dialog-window/popover-dialog-window';
import { LfPopoverWindow } from './popover/lf-popover-window/lf-popover-window';
import { DialogButtonBar } from './buttonbar/dialog-buttonbar';
import { ModalDialog } from '.';

export const LF_DIALOG_EXPORTS: Array<any> = [PopoverDialog, CardDialog];

@NgModule({
    imports: [CommonModule, FormsModule, ComposeModule, LfButtonModule],
    declarations: [
        DialogButtonBar,
        ModalDialogWindow,
        CardDialog,
        ConfirmDialogContent,
        PopoverDialog,
        PopoverDialogWindow,
        LfPopoverWindow
    ],
    providers: [ModalDialog, { provide: PopoverConfig, useFactory: popoverConfigFactory }],
    exports: [LF_DIALOG_EXPORTS],
    entryComponents: [
        // Components loaded dynamically (not via Router)
        ConfirmDialogContent,
        ModalDialogWindow,
        LfPopoverWindow,
        PopoverDialogWindow
    ]
})
export class LfDialogModule {}

// Default settings for popovers
export function popoverConfigFactory(): PopoverConfig {
    const popoverConfig = new PopoverConfig();
    popoverConfig.autoClose = 'outside';
    popoverConfig.triggers = 'click:'; // 'hover'
    popoverConfig.placement = ['bottom', 'auto'];
    popoverConfig.keepOpenForClasses = ['ui-dropdown-list'];
    popoverConfig.container = 'body';
    return popoverConfig;
}
