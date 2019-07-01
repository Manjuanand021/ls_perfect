import { Injectable } from '@angular/core';

import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';
import { LsAppConfig } from 'ls-core/config';
import { AppSession } from 'ls-core/session';
import { UrlLocaleUtil } from 'ls-core/i18n';

@Injectable()
export class OpenHelpDelegate extends OpenURLDelegate {
    private _config: LsAppConfig;
    private _session: AppSession;

    constructor(config: LsAppConfig, session: AppSession) {
        super();
        this._config = config;
        this._session = session;
    }

    public openURL(url?: string): void {
        super.openURL(this.getHelpUrl());
    }

    private getHelpUrl(): string {
        const urlLocale = UrlLocaleUtil.getUrlLocale(this._session.user);
        const helpUrl = this._config.helpPdfUrl.replace('{locale}', urlLocale);
        return helpUrl;
    }
}
