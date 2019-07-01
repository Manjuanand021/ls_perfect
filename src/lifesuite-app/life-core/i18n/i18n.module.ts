import { NgModule, InjectionToken, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import { I18n } from './i18n';
import { LocaleValidator } from './locale.validator';

export const LOCALE_ID = new InjectionToken<string>('locale_id');

@NgModule({
    providers: [
        I18n,
        LocaleValidator,
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        {
            provide: TRANSLATIONS,
            useFactory: locale => {
                return require(`raw-loader!../../../locale/messages.${locale}.xlf`);
            },
            deps: [LOCALE_ID]
        }
    ]
})
export class I18nModule {}
