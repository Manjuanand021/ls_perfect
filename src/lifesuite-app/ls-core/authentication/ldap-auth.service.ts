import { Injectable, Injector } from '@angular/core';

import { AuthenticationService } from './auth.service';
import { ServiceUrls } from 'ls-core/service';

@Injectable()
export class LDAPAuthenticationService extends AuthenticationService {
    constructor(injector: Injector) {
        super(injector);
    }

    protected getLoginServiceUrl(): string {
        return ServiceUrls.AuthUrl;
    }
}
