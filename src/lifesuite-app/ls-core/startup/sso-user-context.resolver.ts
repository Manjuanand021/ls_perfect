import { Injectable } from '@angular/core';

import { Cookie } from 'ng2-cookies';

import { StartupContext } from 'life-core/startup';
import { AppSession } from 'ls-core/session';
import { LsStartupContextResolver } from './ls-startup-context.resolver';

@Injectable()
export class SSOUserContextResolver extends LsStartupContextResolver<void> {
    constructor(appSession: AppSession) {
        super(appSession);
    }

    protected getContext(): Promise<StartupContext> {
        const startupCookie = this.getStartupCookie();
        let startupContext: StartupContext;
        // console.debug(`${STARTUP_COOKIE_NAME} cookie: `, startupCookie);
        if (startupCookie) {
            this.setSessionTimeout(startupCookie);
            startupContext = this.createStartupContextFromCookie(startupCookie);
            this.setContext(startupContext);
            this.deleteStartupCookie();
        }
        return Promise.resolve(startupContext);
    }

    protected get resolvedContextProperties(): string[] {
        return ['userId'];
    }

    protected restoreData(): void {
        this.session.userId = this.startupContext.userId;
    }

    private getStartupCookie(): StartupCookieModel {
        const startupCookieString = Cookie.get(STARTUP_COOKIE_NAME);
        return startupCookieString ? (JSON.parse(startupCookieString) as StartupCookieModel) : undefined;
    }

    private deleteStartupCookie(): void {
        Cookie.delete(STARTUP_COOKIE_NAME);
    }

    private createStartupContextFromCookie(startupCookie: StartupCookieModel): StartupContext {
        return { userId: startupCookie.Parameters.LoginName } as StartupContext;
    }

    private setSessionTimeout(startupCookie: StartupCookieModel): void {
        this.session.sessionTimeoutMinutes = parseInt(startupCookie.Parameters.SessionTimeoutMinutes);
    }
}

const STARTUP_COOKIE_NAME = 'LSStartup';

export type StartupCookieModel = {
    Parameters: StartupCookieParametersModel;
};

export type StartupCookieParametersModel = {
    LoginName: string;
    SessionTimeoutMinutes: string;
};
