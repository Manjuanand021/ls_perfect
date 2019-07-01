import { Injectable } from '@angular/core';

import { TabStateStore, TabState } from './tab-state-store';

/**
 * Maintains Tab state for each tab inside PrimaryTabView component.
 */
@Injectable({ providedIn: 'root' })
export class PrimaryTabStateStore extends TabStateStore<PrimaryTabState> {
    protected newStateData(): PrimaryTabState {
        return new PrimaryTabState();
    }
}

export class PrimaryTabState extends TabState {
    public rootObjectLoaded: boolean;

    protected initialize(): void {
        this.rootObjectLoaded = false;
    }
}
