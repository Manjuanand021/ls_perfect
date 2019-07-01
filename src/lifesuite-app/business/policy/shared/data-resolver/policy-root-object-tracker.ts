import { Injectable } from '@angular/core';

import { AppSession } from 'ls-core/session/app-session';
import { PrimaryTabStateStore, PrimaryTabState } from 'life-core/component/layout/tabview';

@Injectable()
export class PolicyRootObjectTracker {
    private _appSession: AppSession;
    private _tabStateStore: PrimaryTabStateStore;

    constructor(appSession: AppSession, tabStateStore: PrimaryTabStateStore) {
        this._appSession = appSession;
        this._tabStateStore = tabStateStore;
    }

    public get objectLoaded(): boolean {
        const tabState = this.getTabState();
        return tabState ? tabState.rootObjectLoaded : true;
    }

    public set objectLoaded(loaded: boolean) {
        const tabState = this.getTabState();
        if (tabState) {
            tabState.rootObjectLoaded = loaded;
        }
    }

    private getTabState(): PrimaryTabState {
        return this._appSession.policyId
            ? (this._tabStateStore.getTabStateByObjectId(this._appSession.policyId.toString()) as PrimaryTabState)
            : null;
    }
}
