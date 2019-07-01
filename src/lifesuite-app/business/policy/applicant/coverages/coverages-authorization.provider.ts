import { Injectable, Injector, SkipSelf, Optional } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { PrivilegeObjectType, SubsystemType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { PolicyStatusCodes } from 'business/policy/shared';

@Injectable()
export class CoveragesAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const addCoverageAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.ADDCOVERAGE]
        );

        if (this.policy.PolicyStatusCode === PolicyStatusCodes.CLOSED) {
            this.authorizationData.componentLevel['addCoverageButton'] = addCoverageAuthorizationLevel;
        }
    }
}
