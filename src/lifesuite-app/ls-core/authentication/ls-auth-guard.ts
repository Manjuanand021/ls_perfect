import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { BaseAuthGuard, IAuthenticationService } from 'life-core/authentication';
import { AuthenticationService } from './auth.service';
import { AppSession } from 'ls-core/session';

export abstract class LsAuthGuard extends BaseAuthGuard {
    protected router: Router;
    protected _session: AppSession;

    constructor(injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this._session = injector.get(AppSession);
    }

    protected getAuthService(): IAuthenticationService {
        return this.injector.get(AuthenticationService);
    }

    protected isAuthenticated(): boolean {
        return this._session.userId != undefined;
    }
}
