import { Locale } from './locale';

export function getStandardLocaleId(locale: string, standardLocales: Locale[]): Locale {
    const lcaseLocale = locale.toLowerCase();
    return standardLocales.find(standardLocale => standardLocale.toLowerCase() == lcaseLocale);
}
