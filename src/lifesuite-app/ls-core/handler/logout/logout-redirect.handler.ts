import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IActionHandler, AppCloseChannel } from 'life-core/handler';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { DialogTracker } from 'life-core/component/dialog';
import { AppSession } from 'ls-core/session/app-session';
import { LogoutReason, SSOLogoutRouteByReason, NonSSOLogoutRouteByReason } from './logout-reason';

@Injectable()
export class LogoutRedirectHandler implements IActionHandler {
    private _router: Router;
    private _appSession: AppSession;
    private _logoutReason: LogoutReason;
    private _dialogTracker: DialogTracker;
    private _messagingService: IMessagingService;

    constructor(
        router: Router,
        appSession: AppSession,
        dialogTracker: DialogTracker,
        messagingService: MessagingService
    ) {
        this._router = router;
        this._appSession = appSession;
        this._dialogTracker = dialogTracker;
        this._messagingService = messagingService;
    }

    public execute({
        logoutReason,
        redirectUrl,
        isSSO
    }: {
        logoutReason?: LogoutReason;
        redirectUrl?: string;
        isSSO?: boolean;
    }): void {
        this._logoutReason = logoutReason;
        this.beforeRedirect();
        this.redirect(redirectUrl, isSSO);
    }

    private beforeRedirect(): void {
        if (this._dialogTracker.anyOpenedDialogs()) {
            this._dialogTracker.closeAll();
        }
    }

    private redirect(redirectUrl?: string, isSSO?: boolean): void {
        this._messagingService.publish(AppCloseChannel.ByPassCloseGuard);
        if (isSSO) {
            if (redirectUrl && redirectUrl.length > 0) {
                window.location.replace(redirectUrl);
            } else {
                const route = SSOLogoutRouteByReason[this._logoutReason];
                this.assertRouteExists(route);
                this._router.navigateByUrl(route);
            }
        } else {
            const route = NonSSOLogoutRouteByReason[this._logoutReason];
            this.assertRouteExists(route);
            this._router.navigateByUrl(route);
        }
    }

    private assertRouteExists(route: string): void {
        if (route == undefined) {
            throw new Error(`Undefined route for Logout reason ${this._logoutReason}.`);
        }
    }
}
