import { Injectable, Inject } from '@angular/core';

import { APP_LOCALES, Locale, getStandardLocaleId } from 'life-core/i18n';

import { UserDTO } from 'ls-core/model';

@Injectable()
export class UserLocale {
    private _appLocales: Locale[];

    private readonly _defaultLocale: Locale = Locale.en_US;

    constructor(@Inject(APP_LOCALES) appLocales: Locale[]) {
        this._appLocales = appLocales;
    }

    // Returns user localeId based on user's preferred language code.
    public getUserLocaleId(user: UserDTO): Locale {
        return user.PreferredLanguageCode
            ? getStandardLocaleId(user.PreferredLanguageCode, this._appLocales)
            : this._defaultLocale;
    }
}
