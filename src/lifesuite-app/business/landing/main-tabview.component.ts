import { Component, Injector } from '@angular/core';

import { TabDescriptor, PrimaryTabViewHostViewModel, TabChannels } from 'life-core/component/layout/tabview';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabStateManager } from 'life-core/util';
import { ComponentsStateManager } from 'life-core/component';
import { TabViewStateStore } from 'life-core/component/layout/tabview';
import { ParentChildRegistry } from 'life-core/view-model';
import { AppSession } from 'ls-core/session/app-session';

import { LsTabDescriptorFactory, PrimaryTabType } from 'ui/tabview';
import { TabViewCommunicator } from 'ui/shared/communicator';

import { ActiveApplicantHelperInitializer } from 'business/policy/shared';
import { PolicyCleanupDelegate } from 'business/policy/tab/delegates/policy-cleanup-delegate';

@Component({
    selector: 'main-tabview',
    templateUrl: './main-tabview.component.html',
    providers: [
        // TabStateManager tracks state data for each tab as collection of KeyValue pairs.
        // Registering TabStateManager on this level assumes that state data
        // for BOTH Primary and Secondary tabs is saved on the Primary tab level.
        // In the future, if there are any dynamic Secondary tabs with identical state data,
        // we will need to save it on the Secondary tab level,
        // registering another instance of TabStateManager on the Secondary tab level.
        TabStateManager,
        // Tracks which tabs are opened in Secondary TabViews.
        TabViewStateStore,
        // Tracks state of visual components inside each tab.
        ComponentsStateManager,
        ActiveApplicantHelperInitializer,
        ParentChildRegistry,
        PolicyCleanupDelegate,
        TabViewCommunicator
    ]
})
export class MainTabViewComponent extends PrimaryTabViewHostViewModel {
    private _appSession: AppSession;

    private _messagingService: IMessagingService;

    private _policyCleanupDelegate: PolicyCleanupDelegate;

    constructor(
        injector: Injector,
        // Do not remove TabViewCommunicator dependency. It communicates tab view change.
        _tabViewCommunicator: TabViewCommunicator,
        appSession: AppSession,
        messagingService: MessagingService,
        policyCleanupDelegate: PolicyCleanupDelegate,
        // Do not remove ActiveApplicantHelperInitializer dependency.
        activeApplicantHelperInitializer: ActiveApplicantHelperInitializer
    ) {
        super(injector);
        this._appSession = appSession;
        this._messagingService = messagingService;
        this._policyCleanupDelegate = policyCleanupDelegate;
    }

    protected get tabViewId(): string {
        return 'primaryTabView';
    }

    protected getStaticTabs(): TabDescriptor[] {
        const tabHome = (this.tabDescriptorFactory as LsTabDescriptorFactory).createPrimaryTabDescriptorHome();
        tabHome.selected = true;
        return [tabHome];
    }

    protected onBeforeTabChange(fromTab: TabDescriptor, toTab: TabDescriptor): void {
        this.updateSessionBeforeTabChange(toTab);
    }

    private updateSessionBeforeTabChange(newTab: TabDescriptor): void {
        if (newTab && newTab.tabType == PrimaryTabType.Policy) {
            this._appSession.policyId = parseInt(newTab.objectId);
        } else {
            this._appSession.resetPolicy();
        }
    }

    protected onAfterTabClose(tab: TabDescriptor): void {
        this.cleanupAfterTabClose(tab);
    }

    private cleanupAfterTabClose(tab: TabDescriptor): void {
        if (tab.tabType == PrimaryTabType.Policy) {
            if (this._appSession.policyId == parseInt(tab.objectId)) {
                this._policyCleanupDelegate.cleanup();
            }
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.closeMessagingChannels();
    }

    private closeMessagingChannels(): void {
        this._messagingService.closeChannel(TabChannels.TabChanged);
    }
}
