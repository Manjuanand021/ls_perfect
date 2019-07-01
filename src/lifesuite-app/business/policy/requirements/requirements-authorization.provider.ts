import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';
import { MasterButtonType } from 'life-core/component/master-detail';
import { AppMasterButtonType } from 'business/shared/master-detail';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class RequirementsAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const requirementsAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.REQUIREMENT]
        );
        const addButtonAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.REQUIREMENTADD]
        );

        const noteButtonAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.NOTE]
        );

        this.authorizationData.defaultLevel = requirementsAuthorizationLevel;
        this.authorizationData.componentLevel[MasterButtonType.ADD] = addButtonAuthorizationLevel;
        this.authorizationData.componentLevel[MasterButtonType.CANCEL] = addButtonAuthorizationLevel;
        this.authorizationData.componentLevel[AppMasterButtonType.NOTE] = noteButtonAuthorizationLevel;
    }
}
