import { Injectable } from '@angular/core';
import { I18n as NgxI18n } from '@ngx-translate/i18n-polyfill';

/**
 * A wrapper class for i18n-polyfill to support i18n code translations.
 * This will be replaced in Angular 7.
 */
@Injectable()
export class I18n extends NgxI18n {}
