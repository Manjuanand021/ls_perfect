import { SplitPaneContainerMessagesMapper } from './vm/split-pane-container-messages.mapper';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import { ComposeModule } from 'life-core/component/compose/compose.module';
import { LfSplitComponentModule } from '../split-component/lf-split-component.module';
import { LfSplitPaneComponent } from './lf-split-pane.component';

export const LF_SPLIT_PANE_EXPORTS: Array<any> = [LfSplitPaneComponent];

@NgModule({
    imports: [CommonModule, AngularSplitModule, ComposeModule, LfSplitComponentModule],
    declarations: [LfSplitPaneComponent],
    exports: LF_SPLIT_PANE_EXPORTS,
    providers: [SplitPaneContainerMessagesMapper]
})
export class LfSplitPaneModule {}
