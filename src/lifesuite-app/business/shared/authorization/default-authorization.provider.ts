import { Injectable, SkipSelf, Optional } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { PrivilegeObjectType, SubsystemType, PrivilegeType } from 'ls-core/authorization';

@Injectable()
export class DefaultAuthorizationProvider extends AuthorizationProvider {
    private _authorizationService: AuthorizationService;

    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider,
        authorizationService: AuthorizationService
    ) {
        super(parentAuthProvider);
        this._authorizationService = authorizationService;
    }

    protected setup(): void {
        const defaultAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            null,
            [PrivilegeType.CASE]
        );

        this.authorizationData.defaultLevel = defaultAuthorizationLevel;
    }
}
