import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenuModule } from 'life-core/component/menu/menu.module';
import { LeftNavComponent } from './left-nav.component';
import { LeftMenuDataDelegate } from './left-menu-data.delegate';
import { MenuHandlerFactory, SearchCaseHandler, ReassignCaseHandler, MenuUrlHandler } from './handler';
import { QuickInfoPanelModule } from './quick-info-panel/quick-info-panel.module';
import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';
import { LfDialogModule } from 'life-core/component/dialog/dialog.module';

@NgModule({
    imports: [CommonModule, FormsModule, MenuModule, QuickInfoPanelModule, LfDialogModule],
    declarations: [LeftNavComponent],
    exports: [LeftNavComponent],
    providers: [
        LeftMenuDataDelegate,
        MenuHandlerFactory,
        SearchCaseHandler,
        ReassignCaseHandler,
        MenuUrlHandler,
        OpenURLDelegate
    ]
})
export class LeftNavModule {}
