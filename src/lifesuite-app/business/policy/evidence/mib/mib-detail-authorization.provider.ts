import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class MibDetailAuthorizationProvider extends BaseCaseAuthorizationProvider {
    private _authorizationService: AuthorizationService;

    constructor(
        injector: Injector,
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider,
        authorizationService: AuthorizationService
    ) {
        super(injector, parentAuthProvider);
        this._authorizationService = authorizationService;
    }

    protected setup(): void {
        const mibAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCEMIB]
        );

        this.authorizationData.defaultLevel = mibAuthorizationLevel;
    }
}
