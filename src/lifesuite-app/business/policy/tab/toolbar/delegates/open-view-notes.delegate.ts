import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { OpenAppParams } from 'life-core/startup';
import { AppSession } from 'ls-core/session';
import { StartupForViewNotesContext } from 'ls-core/startup';
import { OpenViewNotesHandler, ActiveApplicantHelper } from 'business/policy/shared';

@Injectable()
export class OpenViewNotesDelegate implements OnDestroy {
    protected injector: Injector;
    protected activeApplicantIdSubscription: Subscription;
    protected activeApplicantId: number;

    constructor(injector: Injector, activeApplicantHelper: ActiveApplicantHelper) {
        this.injector = injector;
        this.activeApplicantIdSubscription = activeApplicantHelper.activeApplicantIdObservable.subscribe(
            activeApplicantId => {
                this.activeApplicantId = activeApplicantId;
            }
        );
    }

    public openView(): void {
        const appSession = this.injector.get(AppSession);
        const startupForViewNotesContext = {
            policyId: appSession.policyId,
            activeApplicantId: this.activeApplicantId
        } as StartupForViewNotesContext;

        const openViewNotesHandler = this.injector.get(OpenViewNotesHandler);
        const params = {
            context: startupForViewNotesContext,
            newInstance: true
        } as OpenAppParams;
        openViewNotesHandler.execute(params);
    }

    public ngOnDestroy(): void {
        this.activeApplicantIdSubscription.unsubscribe();
    }
}
