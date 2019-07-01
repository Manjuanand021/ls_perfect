import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { PolicyToolbarModule } from './toolbar/policy-toolbar.module';
import { TabPolicyComponent } from './tab-policy.component';
import { TabPolicySplitContainerComponent } from './split-container/tab-policy-split-container.component';
import { SplitPaneContainerMessagesMapper } from 'life-core/component/layout/split/split-pane/vm/split-pane-container-messages.mapper';
import { LSSplitContainerMessagesMapper } from './split-container/ls-split-container-messages.mapper';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, PolicyToolbarModule],
    declarations: [TabPolicyComponent, TabPolicySplitContainerComponent],
    providers: [{ provide: SplitPaneContainerMessagesMapper, useClass: LSSplitContainerMessagesMapper }]
})
export class TabPolicyModule {}
