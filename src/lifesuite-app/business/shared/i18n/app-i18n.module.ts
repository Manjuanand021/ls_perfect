import { NgModule } from '@angular/core';

import { I18nModule, IntlModule } from 'life-core/i18n';
import { LsI18nModule } from 'ls-core/i18n';

import { APP_LOCALES, DEFAULT_LOCALE_ID, Locale } from 'life-core/i18n';

export const DEFINED_APP_LOCALES = [
    { provide: APP_LOCALES, useValue: Locale.en_US, multi: true },
    { provide: APP_LOCALES, useValue: Locale.fr_CA, multi: true }
];

@NgModule({
    imports: [I18nModule, IntlModule, LsI18nModule],
    providers: [...DEFINED_APP_LOCALES, { provide: DEFAULT_LOCALE_ID, useValue: Locale.en_US }]
})
export class AppI18nModule {}
