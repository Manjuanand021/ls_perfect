import { Injectable, SkipSelf, Optional } from '@angular/core';

import { AuthorizationProvider, AuthorizationLevel } from 'life-core/authorization';

@Injectable()
export class TestMasterDetailAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = AuthorizationLevel.EDIT;
    }
}
