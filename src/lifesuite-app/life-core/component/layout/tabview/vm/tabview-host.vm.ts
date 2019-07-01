import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { ViewModel } from 'life-core/view-model';
import { TabStateManager } from 'life-core/util';
import { ITabViewManager } from '../manager/tabview.manager';
import { StatefulTabViewManager } from '../manager/stateful-tabview.manager';
import { TabData, TabDescriptor } from '../model';
import { TabCloseEvent, TabChangeEvent } from '../event/tab.event';
import { TabDescriptorFactory } from '../tab-descriptor/tab-descriptor.factory';

/**
 * Base ViewModel class for components hosting TabView
 */
export abstract class TabViewHostViewModel extends ViewModel {
    /**
     * Manager of TabView component
     */
    protected tabViewManager: ITabViewManager;

    protected abstract createTabViewManager(): ITabViewManager;

    protected abstract get tabViewId(): string;

    protected stateManager: TabStateManager;

    protected tabDescriptorFactory: TabDescriptorFactory;

    constructor(injector: Injector) {
        super(injector);
        this.stateManager = this.injector.get(TabStateManager);
        this.tabDescriptorFactory = this.injector.get(TabDescriptorFactory);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // The earliest time TabViewManager could be created is in ngOnInit()
        // to allow passing compositeTabId from parent component to this ViewModel.
        this.tabViewManager = this.createTabViewManager();
        this.addStaticTabs();
    }

    public onTabClose(event: TabCloseEvent): void {
        const fnAfterTabClosed = (tab: TabDescriptor): void => {
            this.onAfterTabClose(tab);
        };
        event.afterClose = fnAfterTabClosed;
        this.tabViewManager.onTabClose(event);
    }

    public onTabSelectionChange(event: TabChangeEvent): void {
        const fnBeforeTabChanged = (from: TabDescriptor, to: TabDescriptor): void => {
            this.onBeforeTabChange(from, to);
        };
        event.beforeChange = fnBeforeTabChanged;
        this.tabViewManager.onTabSelectionChange(event);
    }

    public get initialSelectedIndex$(): Observable<number> {
        return this.tabViewManager.initialSelectedIndex$;
    }

    public get tabsData$(): Observable<TabData[]> {
        return this.tabViewManager.tabsData$;
    }

    public setSelectedTabByName(tabName: string): void {
        this.tabViewManager.setSelectedTabByName(tabName);
    }

    // public selectAndUpdateTabRoute(tabName: string, route: string): void {
    //     this.tabViewManager.selectAndUpdateTabRoute(tabName, route);
    // }

    public getSelectedTab(): TabDescriptor {
        return this.tabViewManager.getSelectedTab();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.tabViewManager.destroy();
    }

    protected setupAuthorization(): void {
        super.setupAuthorization();
        this.tabViewManager.setupTabsAuthorization(this.authorizationData);
    }

    protected abstract getStaticTabs(): TabDescriptor[];

    /**
     * Override to do extra work after tab closed
     */
    protected onAfterTabClose(tab: TabDescriptor): void {}

    /**
     * Override to do extra work before tab changes
     */
    protected onBeforeTabChange(from: TabDescriptor, to: TabDescriptor): void {}

    protected updateStaticTabs(tabDescriptors: TabDescriptor[]): void {
        // Client hook to do extra setup for tabs
        this.tabViewManager.updateTabs(tabDescriptors);
    }

    protected addTabs(tabDescriptors: TabDescriptor[]): void {
        this.tabViewManager.addTabs(tabDescriptors);
    }

    protected addTab(tabDescriptor: TabDescriptor): void {
        this.tabViewManager.addTab(tabDescriptor);
    }

    private addStaticTabs(): void {
        let tabs = this.getSavedStaticTabs();
        if (!tabs || tabs.length == 0) {
            tabs = this.getStaticTabs();
        }
        if (tabs && tabs.length) {
            // this.updateStaticTabs(tabs);
            this.addTabs(tabs);
        }
    }

    private getSavedStaticTabs(): TabDescriptor[] {
        return this.tabViewManager instanceof StatefulTabViewManager
            ? (this.tabViewManager as StatefulTabViewManager).getSavedStaticTabData()
            : [];
    }
}
