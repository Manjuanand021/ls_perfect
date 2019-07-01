import { Injectable, SkipSelf, Optional, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationService } from 'life-core/authorization';

import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { TabDefLab, TabDefMVR, TabDefRx, TabDefMedicalCondition, TabDefMIB, TabDefParamedical } from 'ui/tabview';

import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class EvidenceAuthorizationProvider extends BaseCaseAuthorizationProvider {
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
        const evidenceAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCE]
        );

        const tabLabAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCELAB]
        );

        const tabMIBAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCEMIB]
        );

        const tabMVRAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCEMVR]
        );

        const tabRXAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCERX]
        );

        const tabMedicalConditionAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCEMEDICALCOND]
        );

        const tabParamedicalAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.EVIDENCEPARAMEDICAL]
        );

        this.authorizationData.defaultLevel = evidenceAuthorizationLevel;

        this.authorizationData.componentLevel[TabDefLab.name] = tabLabAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefMIB.name] = tabMIBAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefMVR.name] = tabMVRAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefRx.name] = tabRXAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefMedicalCondition.name] = tabMedicalConditionAuthorizationLevel;
        this.authorizationData.componentLevel[TabDefParamedical.name] = tabParamedicalAuthorizationLevel;
    }
}
