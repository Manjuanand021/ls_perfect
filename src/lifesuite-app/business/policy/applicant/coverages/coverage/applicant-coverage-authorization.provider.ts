import { Injectable, Injector, SkipSelf, Optional, Self } from '@angular/core';

import {
    AuthorizationProvider,
    AuthorizationService,
    AuthorizationLevel,
    AuthorizationProviderHost
} from 'life-core/authorization';

import { CoverageDTO } from 'ls-core/model';
import { PrivilegeObjectType, SubsystemType, PrivilegeType } from 'ls-core/authorization';

import { CoverageStatuses } from 'business/policy/shared';
import { BaseCaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Injectable()
export class ApplicantCoverageAuthorizationProvider extends BaseCaseAuthorizationProvider {
    private _authorizationService: AuthorizationService;

    constructor(
        injector: Injector,
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider,
        @Self()
        @Optional()
        authorizationProviderHost: AuthorizationProviderHost,
        authorizationService: AuthorizationService
    ) {
        super(injector, parentAuthProvider);
        this.authorizationProviderHost = authorizationProviderHost;
        this._authorizationService = authorizationService;
    }

    protected setup(): void {
        const coverageAuthorizationLevel = this._authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.CASE]
        );
        const coverage = this.authorizationProviderHost.getAuthorizationProviderContext() as CoverageDTO;
        this.authorizationData.componentLevel['fundList'] =
            coverageAuthorizationLevel < AuthorizationLevel.EDIT ? AuthorizationLevel.VIEW : coverageAuthorizationLevel;

        this.authorizationData.defaultLevel = this.getDefaultAuthorizationLevel(coverageAuthorizationLevel, coverage);
    }

    private getDefaultAuthorizationLevel(
        coverageAuthorizationLevel: AuthorizationLevel,
        coverage: CoverageDTO
    ): AuthorizationLevel {
        return this.isCoverageClosed(coverage) || coverageAuthorizationLevel === AuthorizationLevel.VIEW
            ? AuthorizationLevel.VIEW
            : AuthorizationLevel.EDIT;
    }

    private isCoverageClosed(coverage: CoverageDTO): boolean {
        return (
            coverage.CoverageStatus == CoverageStatuses.CANCELLED ||
            coverage.CoverageStatus == CoverageStatuses.DECLINED ||
            coverage.CoverageStatus == CoverageStatuses.WITHDRAWN ||
            coverage.CoverageStatus == CoverageStatuses.APPROVED
        );
    }
}
