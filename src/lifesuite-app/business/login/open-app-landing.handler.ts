import { Injectable } from '@angular/core';

import { OpenAppParams, StartupContextUtil } from 'life-core/startup';
import { LsOpenAppHandler } from 'ls-core/startup';
import { AppSession } from 'ls-core/session';
import { RoutePath } from 'life-core/routing';

@Injectable()
export class OpenAppLandingHandler extends LsOpenAppHandler {
    constructor(startupContextUtil: StartupContextUtil, appSession: AppSession) {
        super(startupContextUtil, appSession);
    }

    protected getRoute(params: OpenAppParams): string {
        return `${this.urlLocale}/${RoutePath.Index}/${RoutePath.App}`;
    }
}
