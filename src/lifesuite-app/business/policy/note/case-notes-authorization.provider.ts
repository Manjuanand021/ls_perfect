import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { NotesComponentLevelPrivileges } from './notes-component-level-privileges';

@Injectable()
export class CaseNotesAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const caseNotesAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.NOTE]
        );

        this.authorizationData.componentLevel[NotesComponentLevelPrivileges.AddCaseNote] = caseNotesAuthorizationLevel;
        this.authorizationData.componentLevel[
            NotesComponentLevelPrivileges.AddSupplementalNote
        ] = caseNotesAuthorizationLevel;
    }
}
