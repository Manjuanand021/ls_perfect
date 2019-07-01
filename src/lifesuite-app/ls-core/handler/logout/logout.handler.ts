import { Injectable, Injector } from '@angular/core';

import { SaveTabHandler } from 'life-core/handler';
import { SignalRServiceRegistry } from 'life-core/signalr';
import { LogoutRequest } from 'life-core/authentication';

import { AppSession } from 'ls-core/session/app-session';
import { AuthenticationService } from 'ls-core/authentication';
import { MetadataLoader } from 'ls-core/util';
import { IUIResponse } from 'ls-core/service';

import { LogoutRedirectHandler } from './logout-redirect.handler';
import { LogoutReason } from './logout-reason';

@Injectable()
export class LogoutHandler extends SaveTabHandler {
    private _authService: AuthenticationService;
    private _appSession: AppSession;
    private _logoutRedirectHandler: LogoutRedirectHandler;
    private _logoutReason: LogoutReason;
    private _signalRServiceRegistry: SignalRServiceRegistry;
    private _metadataLoader: MetadataLoader;

    constructor(
        injector: Injector,
        authService: AuthenticationService,
        appSession: AppSession,
        logoutRedirectHandler: LogoutRedirectHandler,
        signalRServiceRegistry: SignalRServiceRegistry,
        metadataLoader: MetadataLoader
    ) {
        super(injector);
        this._authService = authService;
        this._appSession = appSession;
        this._logoutRedirectHandler = logoutRedirectHandler;
        this._signalRServiceRegistry = signalRServiceRegistry;
        this._metadataLoader = metadataLoader;
    }

    public execute(logoutReason?: LogoutReason): void {
        this._logoutReason = logoutReason;
        if (this.needToSaveData()) {
            super.execute();
        } else {
            this.logout();
        }
    }

    protected needToSaveData(): boolean {
        return this.isUserLogout();
    }

    protected isUserLogout(): boolean {
        return this._logoutReason == LogoutReason.UserLogout;
    }

    protected onSaveSucceed(): void {
        this.logout();
    }

    protected onNoNeedToSave(): void {
        this.logout();
    }

    protected onSaveFailed(): void {
        this.logout();
    }

    protected logout(): void {
        const logoutRequest = new LogoutRequest(this._appSession.userId);
        this._authService
            .logout(logoutRequest)
            .then((response: IUIResponse) => {
                const redirectUrl = response.responsePayload as string;
                this.onLogout(redirectUrl);
            })
            // temporary solution until BE fixes the issue of rejecting logout call after failed login attempt
            .catch(error => {
                this.onLogout();
            });
    }

    private onLogout(redirectUrl?: string): void {
        const isSSO = this._appSession.isSSO;
        this._appSession.reset();
        this._metadataLoader.clear();
        this._signalRServiceRegistry.stopAll();
        this._logoutRedirectHandler.execute({ logoutReason: this._logoutReason, redirectUrl, isSSO });
    }
}
