import { Injectable, Injector } from '@angular/core';

import { LsAuthGuard } from 'ls-core/authentication';
import { RoutePath } from 'life-core/routing';

@Injectable()
export class AppAuthGuard extends LsAuthGuard {
    constructor(injector: Injector) {
        super(injector);
    }

    protected handleUnauthenticated(): void {
        if (this._session.initializeError) {
            this.router.navigateByUrl(RoutePath.AppInitializeError);
        } else {
            this.router.navigateByUrl(RoutePath.Login);
        }
    }
}
