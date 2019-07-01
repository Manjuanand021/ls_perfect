import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class CoverageAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const coverageAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.CASE]
        );

        const caseReopenAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.CASEREOPEN]
        );
        const caseApproveAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.CASEAPPROVE]
        );

        this.authorizationData.defaultLevel = coverageAuthorizationLevel;
        this.authorizationData.componentLevel['reopenCaseButton'] = caseReopenAuthorizationLevel;
        this.authorizationData.componentLevel['caseApprove'] = caseApproveAuthorizationLevel;
    }
}
