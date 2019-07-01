import { Injectable } from '@angular/core';

import { StartupContextDataStore } from 'life-core/startup';

/**
 * Defines user session for tracking user session id
 * and other client side session state variables.
 */
@Injectable()
export class Session {
    public sessionId: string;

    public userId: string;

    public isSSO: boolean;

    /**
     * whether this session is a standalone session (e.g. 2nd application instance)
     */
    public isStandalone: boolean;

    public initializeError: string;

    public sessionTimeoutMinutes: number;

    public startupContextDataStore: StartupContextDataStore;

    constructor() {
        this.startupContextDataStore = new StartupContextDataStore();
    }

    /**
     * Resets user session.
     */
    public reset(): void {
        this.sessionId = undefined;
        this.userId = undefined;
        this.isSSO = undefined;
        this.isStandalone = undefined;
        this.initializeError = undefined;
        this.sessionTimeoutMinutes = undefined;
        this.resetStartupContextData();
    }

    public resetStartupContextData(): void {
        this.startupContextDataStore = undefined;
    }
}
