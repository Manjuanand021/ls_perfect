import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TOOLBAR_POPOVER_DIALOG_PARAMS_MAP } from 'life-core/component/toolbar';

import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseLogMetaDataResolver } from 'business/policy/case-log/filter/case-log-metadata.resolver';
import { UnderwriteService } from 'business/policy/tab/services/underwriter.service';
import { ToolBarService, ToolBarSetupDelegate, lsPopoverDialogParamsMap } from 'business/shared/toolbar';

import { OpenCaseLogViewDelegate, UnderwriteCaseDelegate, OpenViewNotesDelegate, OpenHelpDelegate } from './delegates';
import { PolicyToolbarComponent } from './policy-toolbar.component';

@NgModule({
    imports: [CommonModule, LsComponentsModule],
    declarations: [PolicyToolbarComponent],
    providers: [
        OpenViewNotesDelegate,
        OpenCaseLogViewDelegate,
        UnderwriteCaseDelegate,
        CaseLogMetaDataResolver,
        UnderwriteService,
        { provide: TOOLBAR_POPOVER_DIALOG_PARAMS_MAP, useValue: lsPopoverDialogParamsMap },
        ToolBarService,
        ToolBarSetupDelegate,
        OpenURLDelegate,
        OpenHelpDelegate
    ],
    exports: [PolicyToolbarComponent]
})
export class PolicyToolbarModule {}
