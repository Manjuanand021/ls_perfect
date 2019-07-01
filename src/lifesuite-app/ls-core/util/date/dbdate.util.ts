import { DatePipe } from '@angular/common';

import { Locale } from 'life-core/i18n';
import { CompareResult } from 'life-core/util/lang';
import { DateUtil } from 'life-core/util';
import { DBDate, DBDateCrypted } from 'ls-core/model';

// TODO: Replace this hard-code with DB System Setting 'DateFormat'
const dateTimeFormat = 'MM/dd/y HH:mm:ss';

export class DBDateUtil {
    // Port from Flex UI
    public static dateToDBDate(date: Date, locale: string = Locale.en_US): DBDate {
        const newDate = new DBDate();
        if (date != null) {
            newDate.datetime = date;
            // newDate.dbDateFmt = FormatUtil.getDateFormatString();
            // newDate.dbDateTimeFmt = FormatUtil.getDateTimeFormatString();
            // newDate.dateAsString = FormatUtil.formatDate(date);
            // TODO - see comment on line 7.
            newDate.dateAndTimeAsString = new DatePipe(locale).transform(date, dateTimeFormat);
            // newDate.dateAndTimeAsString = FormatUtil.formatDate(date, true);
            // newDate.timeAsString = FormatUtil.formatDate(date, false, true); //date.toTimeString();
        }
        return newDate;
    }

    // Port from Flex UI
    public static serverDateTime(dbDate: DBDate): Date {
        let date: Date = null; // C07
        if (dbDate != null && dbDate.dateAndTimeAsString && dbDate.dateAndTimeAsString != '') {
            date = dbDate.datetime; // C07
            let dateTime: string = dbDate.dateAndTimeAsString;
            // C03 trim off milliseconds if they are present or Date.parse returns NaN
            if (dateTime.indexOf('.') != -1) {
                dateTime = dateTime.slice(0, dateTime.indexOf('.'));
            }
            // C03 change hypens to slashes or Date.parse returns NaN
            if (dateTime.indexOf('GMT-') == -1 && dateTime.indexOf('-') != -1) {
                // C05
                const badDateDelimiterPattern: RegExp = /-/g;
                dateTime = dateTime.replace(badDateDelimiterPattern, '/');
            }
            const milliseconds: number = Date.parse(dateTime);
            date = new Date(milliseconds);
        }
        return date;
    }

    public static dateToDBDateCrypted(date: Date, locale: string = Locale.en_US): DBDateCrypted {
        const dbDateCrypted = new DBDateCrypted();
        dbDateCrypted.datetime = date;
        dbDateCrypted.dateAndTimeAsString = new DatePipe(locale).transform(date, dateTimeFormat);
        return dbDateCrypted;
    }

    public static compareDates(date1: DBDate, date2: DBDate): CompareResult {
        return DateUtil.compareDates(new Date(date1.datetime), new Date(date2.datetime));
    }

    public static isDateSet(dbDate: DBDate): boolean {
        return dbDate && dbDate.dateAndTimeAsString ? true : false;
    }
}
