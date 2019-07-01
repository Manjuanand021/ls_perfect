import { Injectable } from '@angular/core';

import { StartupContext } from 'life-core/startup';
import { LsStartupContextResolver, StartupForViewNotesContext } from 'ls-core/startup';
import { AppSession } from 'ls-core/session';

@Injectable()
export class ViewNotesContextResolver extends LsStartupContextResolver<number> {
    constructor(appSession: AppSession) {
        super(appSession);
    }

    protected get resolvedContextProperties(): string[] {
        return ['activeApplicantId'];
    }

    protected restoreData(): number {
        return (this.startupContext as StartupForViewNotesContext).activeApplicantId;
    }

    protected getContext(): Promise<StartupContext> {
        const context = this.session.startupContextDataStore.getData();
        return Promise.resolve(context);
    }
}
