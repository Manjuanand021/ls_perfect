import { Injectable } from '@angular/core';

import { StartupContext } from 'life-core/startup';
import { LoginRequest, LoginResponse } from 'life-core/authentication';
import { ILogger, Logger } from 'life-core/logging';
import { AppSession } from 'ls-core/session';
import { UIResponse } from 'ls-core/service';
import { LsStartupContextResolver } from './ls-startup-context.resolver';
import { LDAPAuthenticationService } from 'ls-core/authentication';

/*
 * SSO Resolver for Active Directory
 */

@Injectable()
export class SSOADUserContextResolver extends LsStartupContextResolver<void> {
    private _ldapAuthService: LDAPAuthenticationService;
    private _logger: ILogger;

    constructor(appSession: AppSession, ldapAuthService: LDAPAuthenticationService, logger: Logger) {
        super(appSession);
        this._ldapAuthService = ldapAuthService;
        this._logger = logger;
    }

    protected getContext(): Promise<StartupContext> {
        return this.tryActiveDirectoryLogin().then(loginResponse => {
            const isAuthenticated = loginResponse && loginResponse.UserID != null;
            if (isAuthenticated) {
                this.setSessionTimeout(loginResponse.SessionTimeoutMinutes);
                return this.createStartupContext(loginResponse.LoginName);
            } else {
                return undefined;
            }
        });
    }

    private tryActiveDirectoryLogin(): Promise<LoginResponse> {
        const adloginRequest = new LoginRequest('', '');
        return this._ldapAuthService
            .login(adloginRequest)
            .then(response => {
                this._logger.log('SSOADUserContextResolver tryActiveDirectoryLogin result', response);
                this.resolveError = this.getResolveError(response);
                return response.responsePayload as LoginResponse;
            })
            .catch(error => {
                this._logger.error('SSOADUserContextResolver tryActiveDirectoryLogin failed!', error);
                return null;
            });
    }

    private getResolveError(response: UIResponse): string {
        return response.formattedErrors && response.formattedErrors.length > 0
            ? response.formattedErrors[0].formattedMessage
            : '';
    }

    protected get resolvedContextProperties(): string[] {
        return ['userId'];
    }

    protected restoreData(): void {
        this.session.userId = this.startupContext.userId;
    }

    private createStartupContext(userId: string): StartupContext {
        return { userId: userId } as StartupContext;
    }

    private setSessionTimeout(sessionTimeoutMinutes: number): void {
        this.session.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }
}
