import { Injectable } from '@angular/core';

import { BaseStateStore } from './base-state-store';
import { TabDescriptor } from '../model';

/**
 * Maintains the state of opened tabs for each TabView in application.
 * This is used for Secondary (nested level) TabView components.
 */
@Injectable()
export class TabViewStateStore extends BaseStateStore<Array<TabDescriptor>, string> {
    public hasTabViewState(tabViewId: string): boolean {
        return this.hasState(tabViewId);
    }

    public createTabViewState(tabViewId: string): void {
        this.createState(tabViewId);
    }

    public setTabViewState(tabViewId: string, value: Array<TabDescriptor>): void {
        this.setState(tabViewId, value);
    }

    public getTabViewState(tabViewId: string): Array<TabDescriptor> {
        return this.getState(tabViewId);
    }

    public deleteTabViewState(tabViewId: string): void {
        this.deleteState(tabViewId);
    }

    /**
     * Deletes state of the TabViews inside dynamic tabs (where ObjectId is defined).
     */
    public deleteDynamicTabViewStates(tabViewObjectId: string): void {
        if (tabViewObjectId) {
            this.store.forEach((value, key) => {
                if (this.tabViewKeyMatches(key, tabViewObjectId)) {
                    this.deleteState(key);
                }
            });
        }
    }

    private tabViewKeyMatches(tabViewId: string, objectId: string): boolean {
        // The format of tabViewId is [tabViewName-objectId]
        const keyParts = tabViewId.split('-');
        return keyParts.length > 1 ? objectId == keyParts[1] : false;
    }

    protected keyToString(key: string): string {
        return key;
    }

    protected newStateData(): Array<TabDescriptor> {
        return [];
    }
}
