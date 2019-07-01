import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';

import { TabDefParamedical } from 'ui/tabview';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class ParamedicalAuthorizationProvider extends BaseCaseAuthorizationProvider {
    constructor(
        injector: Injector,
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(injector, parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = this.getParentAuthorizationLevel(TabDefParamedical.name);
    }
}
