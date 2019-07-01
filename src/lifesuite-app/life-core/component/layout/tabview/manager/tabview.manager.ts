import { Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { DataSaveStatus, SaveDataCallback, AppCloseChannel } from 'life-core/handler';
import { MessagingChannelUtil } from 'life-core/messaging/messaging-channel.util';
import { Logger, ILogger } from 'life-core/logging';

import { TabData, TabDescriptor, TabContainerType, CompositeTabId, TAB_INDEX_UNDEFINED } from '../model';
import { TabChangeEvent, TabCloseEvent } from '../event/tab.event';
import { TabChannels } from '../messaging/tab-channels';
import { SaveTabChannelData, SaveTabDataContext } from '../messaging/save-tab-channel-data';
import { DialogButton, DialogButtonType, ConfirmDialog } from 'life-core/component/dialog';
import { AuthorizationData } from 'life-core/authorization';
import { AuthorizationUtil } from 'life-core/component/authorization';
import { SaveAndCloseDataDelegate } from 'life-core/handler/save-and-close-data.delegate';
import { ObfuscateIdUtil } from 'life-core/util';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { TabViewManagerResources } from './tabview.manager.rc';

export interface ITabViewManager {
    addTab(tabDescriptor: TabDescriptor): void;

    addTabs(tabDescriptors: TabDescriptor[]): void;

    updateTab(tabDescriptor: TabDescriptor): void;

    updateTabs(tabDescriptors: TabDescriptor[]): void;

    selectTab(tabDescriptor: TabDescriptor): void;

    onTabClose(event: TabCloseEvent): void;

    onTabSelectionChange(event: TabChangeEvent): void;

    initialSelectedIndex$: Observable<number>;

    tabsData$: Observable<TabData[]>;

    destroy(): void;

    setupTabsAuthorization(authorizationData: AuthorizationData): void;

    setSelectedTabByName(tabName: string): void;

    getSelectedTab(): TabDescriptor;

    removeHiddenTabs(tabDescriptor: TabDescriptor[]): void;
}

/**
 * Base TabView Manager class to manage TabView component
 */
export abstract class TabViewManager implements ITabViewManager {
    protected tabViewId: string;

    /**
     * BehaviorSubject of TabView data model.
     * Communicates TabData[] changes to TabView component.
     */
    private _bsTabsData$: BehaviorSubject<TabData[]>;

    /**
     * Observable of TabView data model;
     * Provides property binding of TabData[] to TabView
     */
    public tabsData$: Observable<TabData[]>;

    /**
     * TabView data model used by TabView manager.
     * Each element of TabDescriptor[] corresponds to a Tab in TabView.
     */
    protected tabDescriptors: TabDescriptor[] = [];

    /**
     * Observable of initially selected tab index;
     * Provides property binding of initial selected index to TabView
     */
    public initialSelectedIndex$: Observable<number>;

    /**
     * BehaviorSubject of initially selected index property.
     * Communicates property value changes to TabView component.
     */
    private _bsInitialSelectedIndex$: BehaviorSubject<number>;

    protected selectedTab: TabDescriptor;

    protected router: Router;

    protected currentRoute: ActivatedRoute;

    protected currentTabRoute: string;

    protected messagingService: IMessagingService;

    /**
     * Abstract ChannelId getter to set Tab Data
     */
    protected abstract get channel_SetTabData(): string;

    /**
     * Abstract ChannelId getter to add Tab
     */
    protected abstract get channel_AddTab(): string;

    /**
     * Abstract ChannelId getter to save Tab
     */
    protected abstract get channel_SaveTab(): string;

    /**
     * Abstract ChannelId getter to select Tab
     */
    protected abstract get channel_SelectTab(): string;

    protected logger: ILogger;

    protected tabViewManagerResources: TabViewManagerResources;

    private _confirmDialog: ConfirmDialog;

    private _saveCloseTabDelegate: SaveAndCloseDataDelegate;

    private _subscriptionTracker: SubscriptionTracker;

    constructor(injector: Injector, tabViewId: string) {
        this.router = injector.get(Router);
        this.currentRoute = injector.get(ActivatedRoute);
        this.messagingService = injector.get(MessagingService);
        this.logger = injector.get(Logger);
        this.tabViewId = tabViewId;
        this.setupObservables();
        this.setupSubscriptions();
        this.logger.log(`Component ${this.constructor.name} loaded.`);
        this._confirmDialog = injector.get(ConfirmDialog);
        this._saveCloseTabDelegate = injector.get(SaveAndCloseDataDelegate);
        this.tabViewManagerResources = injector.get(TabViewManagerResources);
    }

    private setupObservables(): void {
        this._bsTabsData$ = <BehaviorSubject<TabData[]>>new BehaviorSubject([]);
        this.tabsData$ = this._bsTabsData$.asObservable();

        this._bsInitialSelectedIndex$ = <BehaviorSubject<number>>new BehaviorSubject(null);
        this.initialSelectedIndex$ = this._bsInitialSelectedIndex$.asObservable();
        this.updateTabViewWithSelectedTab(TAB_INDEX_UNDEFINED);
    }

    protected setupSubscriptions(): void {
        this._subscriptionTracker = new SubscriptionTracker();
        this._subscriptionTracker.track(
            this.messagingService.subscribe(this.channel_AddTab, (tabDescriptor: TabDescriptor) => {
                this.addTab(tabDescriptor);
            })
        );
        this._subscriptionTracker.track(
            this.messagingService.subscribe(this.channel_SelectTab, (tabDescriptor: TabDescriptor) => {
                this.selectTab(tabDescriptor);
            })
        );
    }

    public addTabs(tabDescriptors: TabDescriptor[]): void {
        tabDescriptors.forEach(td => this.addTab(td));
    }

    public addTab(tabDescriptor: TabDescriptor): void {
        if (this.shouldCheckOpenTabsLimit(tabDescriptor) && this.isOpenTabsLimitReached(tabDescriptor)) {
            this.showOpenTabsLimitReachedMessage();
        } else {
            const existingTab = this.findTabDescriptor(tabDescriptor.compositeTabId);
            if (existingTab) {
                // Update content route in case it's different (e.g. based on Navigation sequence)
                this.updateContentRouteForExistingTab(existingTab, tabDescriptor);
                tabDescriptor = existingTab;
            } else {
                this.tabDescriptors.push(tabDescriptor);
            }
            if (tabDescriptor.selected) {
                this.setSelectedTab(tabDescriptor);
            }
            this.updateTabViewWithTabsData();
            this.messagingService.publish(this.channel_SetTabData, tabDescriptor);
        }
    }

    private shouldCheckOpenTabsLimit(tabDescriptor: TabDescriptor): boolean {
        return tabDescriptor.maxNumberOfOpenTabs != undefined;
    }

    private isOpenTabsLimitReached(tabDescriptor: TabDescriptor): boolean {
        const maxTabsAllowed = tabDescriptor.maxNumberOfOpenTabs;
        const existingOpenedTabsCount = this.tabDescriptors.filter(tab => tab.tabType == tabDescriptor.tabType).length;
        return existingOpenedTabsCount == maxTabsAllowed;
    }

    private showOpenTabsLimitReachedMessage(): void {
        this._confirmDialog.open({
            message: this.getWarningItemConfirmMessage(),
            title: this.getWarningItemDialogTitle(),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    protected getWarningItemDialogTitle(): string {
        return this.tabViewManagerResources.getWarningItemDialogTitle();
    }

    protected getWarningItemConfirmMessage(): string {
        return this.tabViewManagerResources.getWarningItemConfirmMessage();
    }

    public updateTabs(tabDescriptors: TabDescriptor[]): void {
        tabDescriptors.forEach(td => this.updateTab(td));
    }

    public updateTab(tabDescriptor: TabDescriptor): void {
        const existingTab = this.findTabDescriptor(tabDescriptor.compositeTabId);
        if (existingTab) {
            Object.assign(existingTab, tabDescriptor);
            if (existingTab.selected) {
                this.setSelectedTab(existingTab);
            }
            this.updateTabViewWithTabsData();
        }
    }

    public selectTab(tabDescriptor: TabDescriptor): void {
        this.updateTab(tabDescriptor);
    }

    protected updateTabViewWithTabsData(): void {
        const tabsData: TabData[] = this.getTabsData();
        this._bsTabsData$.next(tabsData);
    }

    protected setSelectedTab(tabDescriptor: TabDescriptor): void {
        this.selectedTab = tabDescriptor;
        this.updateTabViewWithSelectedTab(this.tabDescriptors.indexOf(this.selectedTab));
    }

    protected updateTabViewWithSelectedTab(tabIndex: number): void {
        this._bsInitialSelectedIndex$.next(tabIndex);
    }

    private updateContentRouteForExistingTab(existingTab: TabDescriptor, newTab: TabDescriptor): void {
        if (existingTab.contentRoute != newTab.contentRoute) {
            existingTab.contentRoute = newTab.contentRoute;
        }
    }

    private getTabsData(): TabData[] {
        return this.tabDescriptors.map(td => {
            return this.createTabData(td);
        });
    }

    private createTabData(tabDescriptor: TabDescriptor): TabData {
        const tabData = new TabData({
            id: tabDescriptor.compositeTabId.toString(),
            title: tabDescriptor.title,
            leftIcon: tabDescriptor.leftIcon,
            route: tabDescriptor.route,
            closable: tabDescriptor.closable,
            disabled: tabDescriptor.disabled,
            authorizationLevel: tabDescriptor.authorizationLevel
        });
        return tabData;
    }

    protected saveTab(tabIndex: number, onTabSaved: SaveDataCallback, toCloseTab: boolean): void {
        const tabId = this.tabDescriptors[tabIndex].compositeTabId;
        const isNavigatingAway = true;
        const isTabNavigatingAway = this.channel_SaveTab == TabChannels.SavePrimaryTab;
        if (isTabNavigatingAway) {
            this._saveCloseTabDelegate.saveData(
                onTabSaved,
                new SaveTabDataContext(isNavigatingAway, isTabNavigatingAway)
            );
        } else {
            this.messagingService.publish(
                MessagingChannelUtil.getDynamicChannelId(this.channel_SaveTab, tabId.toString()),
                new SaveTabChannelData(onTabSaved, new SaveTabDataContext(isNavigatingAway, isTabNavigatingAway))
            );
        }
    }

    // Event handlers
    public onTabClose(event: TabCloseEvent): void {
        if (this.tabDescriptors[event.index] == this.selectedTab) {
            const fnOnTabSaved: SaveDataCallback = (saveTabResult: DataSaveStatus) => {
                if (!this.isFailAndCancel(saveTabResult)) {
                    this.prepareCloseTab(saveTabResult, event.index);
                    this.selectedTab = this.tabDescriptors[0];
                    this.tabCloseHandler(event);
                }
            };
            this.saveTab(event.index, fnOnTabSaved, true);
        } else {
            this.tabCloseHandler(event);
        }
    }

    protected tabCloseHandler(event: TabCloseEvent): void {
        if (event.afterClose) {
            event.afterClose(this.tabDescriptors[event.index]);
        }
        if (event.close) {
            event.close();
        }
        this.tabDescriptors.splice(event.index, 1);
        this.updateTabViewWithTabsData();
    }

    public onTabSelectionChange(event: TabChangeEvent): void {
        if (event.fromIndex !== TAB_INDEX_UNDEFINED) {
            const fnOnTabSaved: SaveDataCallback = (saveTabResult: DataSaveStatus) => {
                if (!this.isFailAndCancel(saveTabResult)) {
                    this.prepareCloseTab(saveTabResult, event.fromIndex);
                    this.tabSelectionChangeHandler(event);
                }
            };
            this.saveTab(event.fromIndex, fnOnTabSaved, false);
        } else {
            this.tabSelectionChangeHandler(event);
        }
    }

    private prepareCloseTab(saveTabResult: DataSaveStatus, tabIndex: number): void {
        if (this.isFailAndContinue(saveTabResult)) {
            this.messagingService.publish(AppCloseChannel.ByPassCloseGuard);
        }
        this.closeMessagingChannelsForTab(this.tabDescriptors[tabIndex]);
    }

    private isFailAndCancel(saveTabResult: DataSaveStatus): boolean {
        return saveTabResult == DataSaveStatus.failAndCancel;
    }

    private isFailAndContinue(saveTabResult: DataSaveStatus): boolean {
        return saveTabResult == DataSaveStatus.failAndContinue;
    }

    private tabSelectionChangeHandler(event: TabChangeEvent): void {
        if (event.beforeChange) {
            event.beforeChange(this.tabDescriptors[event.fromIndex], this.tabDescriptors[event.toIndex]);
        }
        if (event.change) {
            event.change();
        }
        this.selectedTab = this.tabDescriptors[event.toIndex];
        if (this.selectedTab) {
            this.navigateToRoute(event.toIndex);
        }
    }

    // Navigation

    private navigateToRoute(tabIndex: number): Promise<boolean> {
        this.messagingService.publish(this.channel_SetTabData, this.tabDescriptors[tabIndex]);
        const tabDescriptor = this.tabDescriptors[tabIndex];
        const route = this.getTabRoute(tabDescriptor);
        if (this.needToNavigate(route)) {
            this.currentTabRoute = route;
            return this.router.navigate([route], { relativeTo: this.currentRoute });
        }
        // return this.router.navigate([route], { relativeTo: this.currentRoute }).then(result => {
        // 	...
        // });
    }

    private getTabRoute(tabDescriptor: TabDescriptor): string {
        const objectIdSegment =
            tabDescriptor.containerType == TabContainerType.Primary && tabDescriptor.objectId
                ? `/${ObfuscateIdUtil.obfuscate(tabDescriptor.objectId)}`
                : '';
        const contentSegment = tabDescriptor.contentRoute ? `/${tabDescriptor.contentRoute}` : '';
        return `${tabDescriptor.route}${objectIdSegment}${contentSegment}`;
    }

    protected abstract needToNavigate(route: string): boolean;

    // Utility methods

    protected findTabDescriptor(tabId: CompositeTabId): TabDescriptor {
        return this.tabDescriptors.find(tabDescriptor => tabDescriptor.compositeTabId.equalTo(tabId));
    }

    protected tabCount(): number {
        return this.tabDescriptors.length;
    }

    // Cleanup
    public destroy(): void {
        this.closeMessagingChannels();
        this.logger.log(`Comp ${this.constructor.name} destroyed.`);
    }

    protected closeMessagingChannels(): void {
        if (this.selectedTab) {
            this.closeMessagingChannelsForTab(this.selectedTab);
        }
        if (this.messagingService.channelExist(this.channel_AddTab)) {
            this.messagingService.closeChannel(this.channel_AddTab);
        }
        if (this.messagingService.channelExist(this.channel_SelectTab)) {
            this.messagingService.closeChannel(this.channel_SelectTab);
        }
        this._subscriptionTracker.destroy();
    }

    protected closeMessagingChannelsForTab(td: TabDescriptor): void {
        const channelSaveTabId = MessagingChannelUtil.getDynamicChannelId(
            this.channel_SaveTab,
            td.compositeTabId.toString()
        );
        if (this.messagingService.channelExist(channelSaveTabId)) {
            this.messagingService.closeChannel(channelSaveTabId);
        }
    }

    // Authorization

    /**
     * Update tab authorization by matching tab names
     */
    public setupTabsAuthorization(authorizationData: AuthorizationData): void {
        this.tabDescriptors.forEach(tab => {
            tab.authorizationLevel = authorizationData.getLevel(tab.tabName);
        });
        this.tabDescriptors = this.filterAuthorizedTabs(this.tabDescriptors);
        this.ensureSelectedTab(this.tabDescriptors);
        this.updateTabs(this.tabDescriptors);
    }

    private filterAuthorizedTabs(tabDescriptors: TabDescriptor[]): TabDescriptor[] {
        return tabDescriptors.filter(tab => {
            return AuthorizationUtil.isLayoutComponentVisible(tab.authorizationLevel);
        });
    }

    private ensureSelectedTab(tabDescriptors: TabDescriptor[]): void {
        const selectedTab = tabDescriptors.find(tab => tab.selected);
        if (!selectedTab && tabDescriptors.length > 0) {
            tabDescriptors[0].selected = true;
        }
    }
    /**
     * Sets selected tab by tab name
     *
     * E.g. MIB 2Yr need the Case to be navigated to Evidence -> MIB-> MIB Report
     * when default selection is Evidence -> Rx -> Rx Report
     */
    public setSelectedTabByName(tabName: string): void {
        const updatedTabs = this.tabDescriptors.map(tab => {
            tab.selected = tab.tabName === tabName ? true : false;
            return tab;
        });
        this.updateTabs(updatedTabs);
    }

    /**
     * Returns active/ selected tab
     */
    public getSelectedTab(): TabDescriptor {
        return this.selectedTab;
    }

    /**
     * Removes hidden tabs from tab descriptors
     */
    public removeHiddenTabs(tabDescriptors: TabDescriptor[]): void {
        this.tabDescriptors = tabDescriptors.filter(tab => !tab.hidden);
        this.updateTabs(this.tabDescriptors);
        this.ensureSelectedTab(this.tabDescriptors);
    }
}
