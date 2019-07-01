import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularSplitModule, SplitComponent, SplitAreaDirective } from 'angular-split';

import { ComponentsModule } from 'life-core/component/components.module';
import { RoutedTabViewModule, TabViewStateStore, TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { MessagingService } from 'life-core/messaging';
import { TabStateManager } from 'life-core/util';
import { TestTabViewRoutingModule } from './test-tabview-routing.module';
import {
    TestRoutedTabView,
    HomeComp,
    SearchComp,
    SimpleComp,
    TabbedComp,
    NestedTabViewHostComp,
    CaseDispComp,
    MessagesComp,
    PolicyDetailComp,
    ParentDataResolver,
    ChildDataResolver
} from './test-routed-tabview';
import { NoteDialog, NoteComponent, ScratchPadDialog, ScratchPadComponent } from './test-split-area';
import { TestTabDescriptorFactory } from './test-tab-descriptor.factory';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AngularSplitModule,
        ComponentsModule,
        RoutedTabViewModule,
        TestTabViewRoutingModule
    ],
    declarations: [
        HomeComp,
        SearchComp,
        SimpleComp,
        TabbedComp,
        NestedTabViewHostComp,
        CaseDispComp,
        MessagesComp,
        PolicyDetailComp,
        TestRoutedTabView,
        NoteDialog,
        NoteComponent,
        ScratchPadDialog,
        ScratchPadComponent
    ],
    exports: [SplitComponent, SplitAreaDirective],
    entryComponents: [NoteDialog, NoteComponent, ScratchPadDialog, ScratchPadComponent],
    providers: [
        TabViewStateStore,
        MessagingService,
        ParentDataResolver,
        ChildDataResolver,
        TabStateManager,
        { provide: TabDescriptorFactory, useClass: TestTabDescriptorFactory }
    ]
})
export class TestTabViewModule {}
