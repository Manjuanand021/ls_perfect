import { BaseStateStore } from './base-state-store';
import { CompositeTabId } from '../model';

/**
 * Base class to maintain Tab state for each tab inside TabView component.
 */
export abstract class TabStateStore<TData extends TabState> extends BaseStateStore<TData, CompositeTabId> {
    public hasTabState(tabId: CompositeTabId): boolean {
        return this.hasState(tabId);
    }

    public createTabState(tabId: CompositeTabId): void {
        this.createState(tabId);
    }

    public setTabState(tabId: CompositeTabId, value: TData): void {
        this.setState(tabId, value);
    }

    public getTabState(tabId: CompositeTabId): TData {
        return this.getTabState(tabId);
    }

    public getTabStateByObjectId(objectId: string): TData {
        let tabState: TData;
        this.store.forEach((value, key) => {
            if (CompositeTabId.getObjectId(key) == objectId) {
                tabState = value;
            }
        });
        return tabState;
    }

    public deleteTabState(tabId: CompositeTabId): void {
        this.deleteState(tabId);
    }

    protected keyToString(key: CompositeTabId): string {
        return key.toString();
    }
}

export abstract class TabState {
    constructor() {
        this.initialize();
    }

    protected abstract initialize(): void;
}
