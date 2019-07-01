import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';
import { MasterButtonType } from 'life-core/component/master-detail';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class BasicInfoAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const matchUnMatchAuthorizationLevel = this.getParentAuthorizationLevel(MasterButtonType.ADD);

        this.authorizationData.componentLevel['matchButton'] = matchUnMatchAuthorizationLevel;
        this.authorizationData.componentLevel['unMatchButton'] = matchUnMatchAuthorizationLevel;

        const existingEvidenceAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.REQORDEROVERRIDE]
        );

        this.authorizationData.componentLevel['chkUseExistingEvidence'] = existingEvidenceAuthorizationLevel;
    }
}
