import { Injectable } from '@angular/core';

import { OpenAppParams, StartupContextUtil } from 'life-core/startup';
import { LsOpenAppHandler, StartupForViewNotesContext } from 'ls-core/startup';
import { AppSession } from 'ls-core/session';
import { RoutePath } from 'life-core/routing';
import { ObfuscateIdUtil } from 'life-core/util';
import { LsRoutePath } from 'ui/routing';

@Injectable()
export class OpenViewNotesHandler extends LsOpenAppHandler {
    constructor(startupContextUtil: StartupContextUtil, appSession: AppSession) {
        super(startupContextUtil, appSession);
    }

    protected getRoute(params: OpenAppParams): string {
        const context = params.context as StartupForViewNotesContext;
        const obfuscatedPolicyId = ObfuscateIdUtil.obfuscate(context.policyId.toString());
        return `${this.urlLocale}/${RoutePath.Index}/${RoutePath.App}/${LsRoutePath.Policy}/${encodeURIComponent(
            obfuscatedPolicyId
        )}/${LsRoutePath.ViewNotes}`;
    }

    protected getOpenWindowOption(): string {
        return 'location=no, menubar=no, status=no, toolbar=no, scrollbars=yes, resizable=yes';
    }
}
