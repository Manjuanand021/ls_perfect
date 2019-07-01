import { Injectable, Injector, SkipSelf, Optional } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { TabDefCaseDisposition, TabDefReviewMessages, TabDefDebitCredit } from 'ui/tabview';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class WorksheetAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const tabCaseDispositionAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.WORKSHEET]
        );

        const tabReviewMessagesAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.REVIEWMESSAGECM, PrivilegeType.REVIEWMESSAGEUW]
        );

        const tabDebitCreditAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.DEBITCREDIT]
        );

        this.authorizationData.componentLevel[TabDefCaseDisposition.name] = tabCaseDispositionAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefReviewMessages.name] = tabReviewMessagesAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefDebitCredit.name] = tabDebitCreditAuthorizationLevel;
    }
}
