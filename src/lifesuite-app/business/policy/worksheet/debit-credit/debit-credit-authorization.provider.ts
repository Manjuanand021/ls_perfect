import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';

import { TabDefDebitCredit } from 'ui/tabview/tab-definitions';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class DebitCreditAuthorizationProvider extends BaseCaseAuthorizationProvider {
    constructor(
        injector: Injector,
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(injector, parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = this.getParentAuthorizationLevel(TabDefDebitCredit.name);
    }
}
