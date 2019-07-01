import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { LsRoutePath } from 'ui/routing';

import { RoutePath } from 'life-core/routing';
import { AppCloseChannel } from 'life-core/handler/application/close-app.interface';
import { SaveTabHandler } from 'life-core/handler';

import { AppSession } from 'ls-core/session/app-session';

import { RefreshPolicyDataResolver } from './refresh-policy-data.resolver';
import { LogPerformanceDelegate } from 'business/policy/shared/log-performance/log-performance.delegate';

import { ViewValidationDelegate } from 'life-core/view-model/validation';

@Injectable()
export class RefreshPolicyHandler extends SaveTabHandler {
    private _router: Router;
    private _appSession: AppSession;
    private _policyResolver: RefreshPolicyDataResolver;
    private _logPerformanceDelegate: LogPerformanceDelegate;
    private _viewValidationDelegate: ViewValidationDelegate;

    constructor(
        injector: Injector,
        router: Router,
        appSession: AppSession,
        policyResolver: RefreshPolicyDataResolver,
        logPerformanceDelegate: LogPerformanceDelegate
    ) {
        super(injector);
        this._router = router;
        this._appSession = appSession;
        this._policyResolver = policyResolver;
        this._logPerformanceDelegate = logPerformanceDelegate;
    }

    public setViewValidationDelegate(delegate: ViewValidationDelegate): void {
        this._viewValidationDelegate = delegate;
    }
    private loadPolicyAndRefreshPage(): void {
        if (this._viewValidationDelegate) {
            this._viewValidationDelegate.resetServerMessages();
        }
        this._policyResolver.directResolve().then(resolvedObject => {
            this.refreshCurrentPage();
        });
    }
    protected onSaveSucceed(): void {
        this.refreshCurrentPage();
    }

    protected onNoNeedToSave(): void {
        this.loadPolicyAndRefreshPage();
    }

    protected onSaveFailed(): void {
        this.loadPolicyAndRefreshPage();
    }

    private refreshCurrentPage(): void {
        const currentUrl = this._router.url;
        const routePath = this.getRefreshableRoutePath(currentUrl);
        if (routePath) {
            let newUrl = currentUrl.substring(0, currentUrl.indexOf(routePath) + routePath.length);
            if (!this.hasRefreshPartInUrl(currentUrl)) {
                newUrl = this.addRefreshPartToUrl(newUrl);
            }
            this._router.navigateByUrl(newUrl).then(result => {
                this.cancelCloseApp();
            });
        }
        this._logPerformanceDelegate.log(false, this._appSession.policyDTO.PolicyNumber, 'caseRefresh');
    }

    private cancelCloseApp(): void {
        this._messagingService.publish(AppCloseChannel.CancelClosingApplication);
    }

    private getRefreshableRoutePath(url: string): string {
        return refreshableRoutePaths.find(path => url.includes(`/${path}`));
    }

    private hasRefreshPartInUrl(url: string): boolean {
        return url.includes(`/${RoutePath.Refresh}`);
    }

    private addRefreshPartToUrl(url: string): string {
        return `${url}/${RoutePath.Refresh}`;
    }
}

const refreshableRoutePaths = [
    LsRoutePath.Worksheet,
    LsRoutePath.Requirements,
    LsRoutePath.Evidence,
    LsRoutePath.Case,
    LsRoutePath.Applicant,
    LsRoutePath.RelatedCases,
    LsRoutePath.PolicyDocuments
];
