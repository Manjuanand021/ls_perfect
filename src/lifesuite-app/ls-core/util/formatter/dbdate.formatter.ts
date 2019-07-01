import { Inject, Injectable } from '@angular/core';

import { LOCALE_ID } from 'life-core/i18n';
import { DateFormatter, DateTimeFormatWidth, DateFormatRetriever } from 'life-core/util/formatter';
import { DBDate } from 'ls-core/model';

@Injectable({
    providedIn: 'root'
})
export class DBDateFormatter extends DateFormatter {
    constructor(@Inject(LOCALE_ID) localeId: string, dateFormatRetriever: DateFormatRetriever) {
        super(localeId, dateFormatRetriever);
    }

    public format(value: any, format: DateTimeFormatWidth | string = DateTimeFormatWidth.ShortDate): string {
        // TODO: Use DBDatePipe here once it's properly adjusted
        if (value && value.dateAndTimeAsString) {
            return super.format((<DBDate>value).dateAndTimeAsString, format);
        }
        return '';
    }
}
