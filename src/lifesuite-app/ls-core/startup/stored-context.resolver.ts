import { Injectable } from '@angular/core';

import { StartupContext, StartupContextUtil, StartupContextStorageKey } from 'life-core/startup';
import { AppSession } from 'ls-core/session';
import { LsStartupContextResolver } from './ls-startup-context.resolver';

@Injectable()
export class StoredContextResolver extends LsStartupContextResolver<void> {
    private _startupContextUtil: StartupContextUtil;

    constructor(startupContextUtil: StartupContextUtil, appSession: AppSession) {
        super(appSession);
        this._startupContextUtil = startupContextUtil;
    }

    protected getContext(): Promise<StartupContext> {
        const context = this._startupContextUtil.getItem(StartupContextStorageKey);
        this.setContext(context);
        this._startupContextUtil.removeItem(StartupContextStorageKey);
        return Promise.resolve(context);
    }

    protected get resolvedContextProperties(): string[] {
        return ['userId'];
    }

    protected restoreData(): void {
        this.session.userId = this.startupContext.userId;
        // 2nd application instance if stored context resolver is invoked
        // this.session.isStandalone = true;
    }
}
