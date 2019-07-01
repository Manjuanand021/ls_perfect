import { Injector } from '@angular/core';

import { ITabViewManager, TabViewManager } from './tabview.manager';
import { TabViewStateStore } from '../state/tabview-state-store';
import { TabDescriptor } from '../model';

export interface IStatefulTabViewManager extends ITabViewManager {
    saveTabViewState(): void;
    restoreTabViewState(): void;
    getSavedStaticTabData(): TabDescriptor[];
}

/**
 *  Implements state management for TabView components that need to maintain state.
 *  These are usually Secondary (nested level) TabView components.
 */
export abstract class StatefulTabViewManager extends TabViewManager implements IStatefulTabViewManager {
    private _stateStore: TabViewStateStore;

    constructor(injector: Injector, tabViewId: string) {
        super(injector, tabViewId);
        this._stateStore = injector.get(TabViewStateStore);
    }

    public restoreTabViewState(): void {
        if (this._stateStore.hasTabViewState(this.tabViewId)) {
            // Restore DYNAMIC tabs only, assuming that STATIC tabs
            // are re-created each time by the TabView host component.
            this.restoreDynamicTabs();
            this._stateStore.deleteTabViewState(this.tabViewId);
        }
    }

    private restoreDynamicTabs(): void {
        const tdToRestore: TabDescriptor[] = [];
        const tdFromState = this._stateStore.getTabViewState(this.tabViewId);
        let selectedTab: TabDescriptor;
        tdFromState.forEach(td => {
            if (td.closable) {
                tdToRestore.push(td);
            }
            if (td.selected) {
                selectedTab = td;
            }
        });
        if (tdToRestore.length > 0) {
            this.addTabs(tdToRestore);
        }
        if (selectedTab) {
            this.setSelectedTab(selectedTab);
        }
    }

    public getSavedStaticTabData(): TabDescriptor[] {
        const tabData: TabDescriptor[] = [];
        const tdFromState = this._stateStore.getTabViewState(this.tabViewId);
        if (tdFromState) {
            tdFromState.forEach(td => {
                if (!td.closable) {
                    tabData.push(td);
                }
            });
        }
        return tabData;
    }

    public saveTabViewState(): void {
        const tabDescriptors = this.prepareTabDescriptorsForSave();
        this._stateStore.setTabViewState(this.tabViewId, tabDescriptors);
    }

    private prepareTabDescriptorsForSave(): TabDescriptor[] {
        const tabDescriptors = this.tabDescriptors;
        tabDescriptors.forEach(td => {
            td.selected = td === this.selectedTab;
        });
        return tabDescriptors;
    }

    public destroy(): void {
        super.destroy();
        this.saveTabViewState();
    }
}
