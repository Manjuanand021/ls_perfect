import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { PrivilegeObjectType, SubsystemType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class OtherRisksAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const defaultAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.DEBITCREDIT]
        );

        this.authorizationData.defaultLevel = defaultAuthorizationLevel;
    }
}
