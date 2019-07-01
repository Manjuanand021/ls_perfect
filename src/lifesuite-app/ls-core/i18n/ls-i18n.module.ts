import { NgModule, LOCALE_ID as NG_LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

// Import all supported locales
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';

import { LOCALE_ID, DEFAULT_LOCALE_ID, Locale, LocaleValidator } from 'life-core/i18n';
import { AppSession } from 'ls-core/session';
import { UserLocale } from './user-locale';

// Returns localeId based on user's locale.
// This method is only called once per session - when LOCALE_ID is used first time.
export function localeIdFactory(
    ngLocaleId: Locale,
    defaultLocaleId: Locale,
    userLocale: UserLocale,
    localeValidator: LocaleValidator,
    appSession: AppSession
): string {
    const userLocaleId = appSession.user ? userLocale.getUserLocaleId(appSession.user) : undefined;
    const localeId = userLocaleId || ngLocaleId || Locale.en_US;
    localeValidator.validateLocale(localeId);
    return localeId;
}

@NgModule({
    providers: [
        {
            provide: LOCALE_ID,
            useFactory: localeIdFactory, // returns locale string
            deps: [NG_LOCALE_ID, DEFAULT_LOCALE_ID, UserLocale, LocaleValidator, AppSession]
        },
        UserLocale
    ]
})
export class LsI18nModule {}

// Register all supported locales here
// TODO: research if locales could be registered dynamically,
// possibly in APP_INITIALIZER based on APP_LOCALES?
// See discussion here:
// https://stackoverflow.com/questions/47158093/angular-5-pipes-and-dynamic-locale

// Register locale 'fr' as 'fr-CA' to support dd/mm/yyyy date format
// TODO: find out why for locale fr-CA the date format is "yy-dd-mm"
// when locale param is passed to AOT production build
// from command defined in package.json
registerLocaleData(localeFr, Locale.fr_CA, localeFrExtra);
// . . .
