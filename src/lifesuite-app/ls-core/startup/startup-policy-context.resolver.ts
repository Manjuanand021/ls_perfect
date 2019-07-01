import { Injectable } from '@angular/core';

import { StartupForPolicyContext } from './ls-startup.model';
import { LsStartupContextResolver } from './ls-startup-context.resolver';
import { AppSession } from 'ls-core/session';
import { StartupContext } from 'life-core/startup';

@Injectable()
export class StartupPolicyContextResolver extends LsStartupContextResolver<void> {
    constructor(appSession: AppSession) {
        super(appSession);
    }

    protected get resolvedContextProperties(): string[] {
        return ['policyId'];
    }

    protected restoreData(): void {
        (<AppSession>this.session).policyId = (<StartupForPolicyContext>this.startupContext).policyId;
    }

    protected getContext(): Promise<StartupContext> {
        const context = this.session.startupContextDataStore.getData();
        return Promise.resolve(context);
    }
}
