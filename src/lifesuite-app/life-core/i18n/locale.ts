import { InjectionToken } from '@angular/core';

// Defines all possible locales
export enum Locale {
    en_US = 'en-US',
    fr_CA = 'fr-CA'
    // ...
}

// Injection token for Locales supported by application
export const APP_LOCALES = new InjectionToken<string[]>('app_locales');

// Injection token for default application locale
export const DEFAULT_LOCALE_ID = new InjectionToken<Locale>('default_locale_id');
