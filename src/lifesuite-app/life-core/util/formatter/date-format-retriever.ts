import { Inject, Injectable } from '@angular/core';
import { FormatWidth, getLocaleDateFormat, getLocaleTimeFormat } from '@angular/common';

import { LOCALE_ID } from 'life-core/i18n';

@Injectable({ providedIn: 'root' })
export class DateFormatRetriever {
    protected localeId: string;
    constructor(@Inject(LOCALE_ID) localeId: string) {
        this.localeId = localeId;
    }

    public getLocaleDateFormat(localeId: string, formatWidth: FormatWidth): string {
        return getLocaleDateFormat(localeId, formatWidth);
    }

    public getLocaleTimeFormat(localeId: string, formatWidth: FormatWidth): string {
        return getLocaleTimeFormat(localeId, formatWidth);
    }
}
