import { Injector } from '@angular/core';

import { TabViewManager } from './tabview.manager';
import { TabChannels } from '../messaging/tab-channels';
import { PrimaryTabStateStore } from '../state/primary-tab-state-store';
import { TabViewStateStore } from '../state/tabview-state-store';
import { TabDescriptor } from '../model';
import { TabCloseEvent } from '../event/tab.event';

/**
 *  TabViewManager class for Primary (main level) components hosting TabView
 */
export class PrimaryTabViewManager extends TabViewManager {
    // This is optional for now, as it only tracks
    // root object's (policy) loaded state for back end purpose.
    private _primaryTabStateStore: PrimaryTabStateStore;

    private _tabViewStateStore: TabViewStateStore;

    constructor(injector: Injector, tabViewId: string) {
        super(injector, tabViewId);
        this._primaryTabStateStore = injector.get(PrimaryTabStateStore, null);
        this._tabViewStateStore = injector.get(TabViewStateStore, null);
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetPrimaryTabData;
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddPrimaryTab;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SavePrimaryTab;
    }

    protected get channel_SelectTab(): string {
        return TabChannels.SelectPrimaryTab;
    }

    protected needToNavigate(route: string): boolean {
        return route != this.currentTabRoute;
    }

    public addTab(tabDescriptor: TabDescriptor): void {
        super.addTab(tabDescriptor);
        if (this._primaryTabStateStore) {
            this._primaryTabStateStore.createTabState(tabDescriptor.compositeTabId);
        }
    }

    protected tabCloseHandler(event: TabCloseEvent): void {
        const tabDescriptor = this.tabDescriptors[event.index];
        if (this._tabViewStateStore) {
            // Delete state of TabViews inside DYNAMIC tabs (where ObjectId is defined).
            // Tthe state of the TabViews inside STATIC tabs will be preserved
            // for the duration of the session.
            this._tabViewStateStore.deleteDynamicTabViewStates(tabDescriptor.compositeTabId.objectId);
        }
        if (this._primaryTabStateStore) {
            this._primaryTabStateStore.deleteTabState(tabDescriptor.compositeTabId);
        }
        super.tabCloseHandler(event);
    }

    // Cleanup
    public destroy(): void {
        super.destroy();
        if (this._tabViewStateStore) {
            this._tabViewStateStore.deleteAll();
        }
        if (this._primaryTabStateStore) {
            this._primaryTabStateStore.deleteAll();
        }
    }
}
