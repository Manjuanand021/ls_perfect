import { Injectable, Inject } from '@angular/core';

import { APP_LOCALES, Locale } from './locale';
import { getStandardLocaleId } from './i18n.util';

@Injectable()
export class LocaleValidator {
    private _appLocales: Locale[];

    constructor(@Inject(APP_LOCALES) appLocales: Locale[]) {
        this._appLocales = appLocales;
    }

    public validateLocale(locale: Locale): void {
        if (getStandardLocaleId(locale, this._appLocales) == undefined) {
            throw new Error(`No locale defined for Locale Id: ${locale}`);
        }
    }
}
