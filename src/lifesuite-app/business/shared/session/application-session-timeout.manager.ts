import { Injector, Injectable } from '@angular/core';

import { SessionTimeoutManager, Seconds_In_Minute } from 'life-core/session';
import { ModalDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { IAuthenticationService, LoginRequest, LoginResponse } from 'life-core/authentication';

import { AppSession } from 'ls-core/session';
import { AuthenticationService } from 'ls-core/authentication';
import { LogoutHandler, LogoutReason } from 'ls-core/handler/logout';
import { SessionTimeOut } from './timeout/session-timeout';

@Injectable()
export class ApplicationSessionTimeoutManager extends SessionTimeoutManager {
    protected logoutHandler: LogoutHandler;

    private _modalDialog: ModalDialog;
    private i18n: I18n;
    private _appSession: AppSession;
    private _authService: IAuthenticationService;

    constructor(
        injector: Injector,
        i18n: I18n,
        logoutHandler: LogoutHandler,
        modalDialog: ModalDialog,
        appSession: AppSession,
        authenticationService: AuthenticationService
    ) {
        super(injector);
        this.logoutHandler = logoutHandler;
        this._modalDialog = modalDialog;
        this.i18n = i18n;
        this._appSession = appSession;
        this._authService = authenticationService;
    }

    protected handleSessionTimeout(): void {
        // logic to login back the user during session timeout when SSO is enabled.
        if (this._appSession.isSSO) {
            const loginRequest: LoginRequest = new LoginRequest('', '');
            this._authService.login(loginRequest).then(response => {
                const loginResponse = response.responsePayload as LoginResponse;
                const isAuthenticated: boolean = loginResponse !== null && loginResponse.UserID !== null;
                if (isAuthenticated) {
                    this.onResumeSessionTimeOut();
                } else {
                    this.logout(LogoutReason.HttpAuthorizationError);
                }
            });
        } else {
            this.openLoginDialog().then(loginResult => {
                if (loginResult) {
                    this.onResumeSessionTimeOut();
                } else {
                    this.logout(LogoutReason.SessionTimeout);
                }
            });
        }
    }

    protected openLoginDialog(): Promise<boolean> {
        return this._modalDialog
            .open({
                view: SessionTimeOut,
                title: this.i18n({ value: 'Session Timeout', id: 'session.timeout.dialog.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK, options: { isDefault: true } }),
                    new DialogButton({ type: DialogButtonType.CANCEL })
                ]
            })
            .then(dialogRef => {
                return dialogRef.result.then(result => {
                    return result.buttonId == DialogButtonType.OK ? result.returnValue : false;
                });
            });
    }

    protected logout(logoutReason: LogoutReason): void {
        this.logoutHandler.execute(logoutReason);
    }

    protected getKeepAliveInterval(): number {
        return Math.floor((this.sessionTimeout * (Seconds_In_Minute - 1)) / SESSION_NUM_PINGS);
    }
}

export const SESSION_NUM_PINGS = 4;
