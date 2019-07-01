import { Injectable } from '@angular/core';

import { AppSession } from 'ls-core/session';
import { ContextResolverResult } from 'life-core/startup';
import { SSOUserContextResolver, SSOADUserContextResolver, StoredContextResolver } from 'ls-core/startup';
import { SystemStartupSettingsRetrievalDelegate } from './system-startup-settings-retrieval.delegate';

@Injectable()
export class AppInitializeService {
    private _appSession: AppSession;

    private _storedContextResolver: StoredContextResolver;
    private _SSOUserContextResolver: SSOUserContextResolver;
    private _SSOADUserContextResolver: SSOADUserContextResolver;
    private _systemStartupSettingsRetrievalDelegate: SystemStartupSettingsRetrievalDelegate;

    constructor(
        storedContextResolver: StoredContextResolver,
        SSOUserContextResolver: SSOUserContextResolver,
        SSOADUserContextResolver: SSOADUserContextResolver,
        appSession: AppSession,
        systemStartupSettingsRetrievalDelegate: SystemStartupSettingsRetrievalDelegate
    ) {
        this._storedContextResolver = storedContextResolver;
        this._SSOUserContextResolver = SSOUserContextResolver;
        this._SSOADUserContextResolver = SSOADUserContextResolver;
        this._appSession = appSession;
        this._systemStartupSettingsRetrievalDelegate = systemStartupSettingsRetrievalDelegate;
    }

    public initialize(): Promise<any> {
        return this.getStartupSettings().then(() => {
            const results: Promise<void>[] = [
                this.initializeUser()
                // Add other initialization services here
                // . . .
            ];
            return Promise.all(results);
        });
    }

    private initializeUser(): Promise<void> {
        return this._storedContextResolver.directResolve().then(result => {
            if (!this.contextResolved(result)) {
                return this._SSOUserContextResolver.directResolve().then(result => {
                    if (this.contextResolved(result)) {
                        this._appSession.isSSO = true;
                        return Promise.resolve();
                    } else {
                        return this._SSOADUserContextResolver.directResolve().then(result => {
                            if (this.contextResolved(result)) {
                                this._appSession.isSSO = true;
                            } else {
                                if (result.resolveError) {
                                    this.handleAppInitializeError(result.resolveError);
                                }
                                // AuthenticationGuard will redirect to login page.
                            }
                        });
                    }
                });
            }
        });
    }

    private contextResolved(result: ContextResolverResult<any>): boolean {
        return result.isResolved;
    }

    private handleAppInitializeError(error: string): void {
        this._appSession.initializeError = error;
    }

    private getStartupSettings(): Promise<void> {
        return this._systemStartupSettingsRetrievalDelegate.getStartupSettings();
    }
}
