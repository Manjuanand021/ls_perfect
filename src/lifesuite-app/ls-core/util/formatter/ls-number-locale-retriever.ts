import { Inject, Injectable } from '@angular/core';

import { LOCALE_ID, APP_LOCALES, Locale, getStandardLocaleId } from 'life-core/i18n';
import { NumberLocaleRetriever } from 'life-core/util/formatter';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

@Injectable()
export class LsNumberLocaleRetriever extends NumberLocaleRetriever {
    // Number locale defined in LS system settings in database.
    // If defined, it will override default number locale.
    private _lsNumberLocale: string;

    constructor(
        @Inject(LOCALE_ID) localeId: string,
        @Inject(APP_LOCALES) appLocales: Locale[],
        lsAppConfig: LsAppConfig
    ) {
        super(localeId);
        this.setLsNumberLocale(lsAppConfig, appLocales);
    }

    private setLsNumberLocale(lsAppConfig: LsAppConfig, appLocales: Locale[]): void {
        const numberLocaleFromSystemSetting = lsAppConfig.getSystemSetting(SystemSetting.HtmlNumberLocale);
        this._lsNumberLocale = numberLocaleFromSystemSetting
            ? getStandardLocaleId(numberLocaleFromSystemSetting, appLocales)
            : null;
    }

    public getNumberLocale(): string {
        return this._lsNumberLocale ? this._lsNumberLocale : super.getNumberLocale();
    }
}
