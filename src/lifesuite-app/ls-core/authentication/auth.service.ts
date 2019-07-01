import { Injectable, Injector } from '@angular/core';

import { BaseAuthenticationService, LoginRequest } from 'life-core/authentication';
import { ServiceUrls, UIResponse } from 'ls-core/service';
import { AppSession } from 'ls-core/session';

@Injectable()
export class AuthenticationService extends BaseAuthenticationService {
    constructor(injector: Injector) {
        super(injector);
        this.session = injector.get(AppSession);
    }

    protected getLoginServiceUrl(): string {
        return ServiceUrls.AuthUrl;
    }

    protected getLogoutServiceUrl(): string {
        return ServiceUrls.LogoutUrl;
    }

    /**
     * Override to return ls-specific type
     */
    public login(loginRequest: LoginRequest): Promise<UIResponse> {
        return super.login(loginRequest);
    }

    public loggedIn(): boolean {
        return this.session.userId != undefined;
    }
}
