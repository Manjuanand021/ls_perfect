import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { RouteResolve, DirectResolve } from 'life-core/view-model/data-resolver';
import { IntlService } from 'life-core/i18n';
import { LsAppConfig, ConfigurationService } from 'ls-core/config';
import { AppSession } from 'ls-core/session/app-session';
import { UserDataDelegate } from 'business/user/user-data.delegate';

@Injectable()
export class LoginUserResolver implements RouteResolve<any>, DirectResolve<any> {
    private _appSession: AppSession;
    private _intl: IntlService;
    private _userDataDelegate: UserDataDelegate;
    private _configurationService: ConfigurationService;
    private _appConfig: LsAppConfig;

    constructor(
        appSession: AppSession,
        userDataDelegate: UserDataDelegate,
        intl: IntlService,
        configurationService: ConfigurationService,
        appConfig: LsAppConfig
    ) {
        this._appSession = appSession;
        this._userDataDelegate = userDataDelegate;
        this._intl = intl;
        this._configurationService = configurationService;
        this._appConfig = appConfig;
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return this.resolveData(route, state);
    }

    public directResolve(): Promise<any> {
        return this.resolveData();
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        return this.restoreUserData().then(user => {
            this.resolveSystemSettings();
            return Promise.resolve(user);
        });
    }

    private restoreUserData(): Promise<any> {
        if (this._appSession.userId && !this._appSession.user) {
            return this._userDataDelegate.getData(this._appSession.userId).then(user => {
                this._appSession.user = user;
                this._appSession.userId = user.LoginId;
                this._intl.localeId = user.PreferredLanguageCode;
                return Promise.resolve(user);
            });
        } else {
            return Promise.resolve(this._appSession.user);
        }
    }

    private resolveSystemSettings(): Promise<void> {
        return this._configurationService.getSystemSettings().then(data => {
            this._appConfig.systemSettings = data;
        });
    }
}
