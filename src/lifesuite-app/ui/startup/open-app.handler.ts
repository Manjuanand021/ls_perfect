import { Injectable } from '@angular/core';

import { OpenAppParams, StartupContextUtil } from 'life-core/startup';
import { RoutePath } from 'life-core/routing';
import { LsOpenAppHandler } from 'ls-core/startup';
import { AppSession } from 'ls-core/session';

@Injectable()
export class OpenAppHandler extends LsOpenAppHandler {
    constructor(startupContextUtil: StartupContextUtil, appSession: AppSession) {
        super(startupContextUtil, appSession);
    }

    protected getRoute(params: OpenAppParams): string {
        return `${this.urlLocale}/${RoutePath.Index}/${RoutePath.App}/${RoutePath.Reload}`;
    }
}
