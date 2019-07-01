import { Inject, Injectable } from '@angular/core';
import { DatePipe, FormatWidth } from '@angular/common';

import { LOCALE_ID } from 'life-core/i18n';
import { ValueFormatter } from './value.formatter';
import { ShortDateFormatInfo, TimeFormatInfo } from './format-info';
import { DateFormatRetriever } from './date-format-retriever';

/**
 * Date and Time format widths
 *
 * For example the date-time formats for the english locale will be:
 *  - `'short'`: `'MM/dd/yyyy, h:mm a'` (e.g. `6/15/2015, 9:03 AM`)
 *  - `'shortDate'`: `'MM/dd/yyyy` (e.g. `6/15/2015`)
 *  - `'shortDateMediumTime'`: `'MM/dd/yyyy h:mm:ss a'` (e.g. `6/15/2015 9:03:01 AM`)
 *  - `'medium'`: `'MMM d, y, h:mm:ss a'` (e.g. `Jun 15, 2015, 9:03:01 AM`)
 *  - `'long'`: `'MMMM d, y, h:mm:ss a z'` (e.g. `June 15, 2015 at 9:03:01 AM GMT+1`)
 */
export enum DateTimeFormatWidth {
    Short = 'short',
    ShortDate = 'shortDate',
    ShortDateMediumTime = 'shortDateMediumTime',
    Medium = 'medium',
    Long = 'long'
}

@Injectable({ providedIn: 'root' })
export class DateFormatter implements ValueFormatter {
    protected dateFormatRetriever: DateFormatRetriever;
    private _localeId: string;
    private static _paddedFormats: { [formatWidth: string]: string } = {};

    constructor(@Inject(LOCALE_ID) localeId: string, dateFormatRetriever: DateFormatRetriever) {
        this._localeId = localeId;
        this.dateFormatRetriever = dateFormatRetriever;
    }

    public format(value: any, format: DateTimeFormatWidth | string = DateTimeFormatWidth.ShortDate): string {
        if (format === DateTimeFormatWidth.Short) {
            format = this.paddedShortFormat;
        } else if (format === DateTimeFormatWidth.ShortDate) {
            format = this.paddedShortDateFormat;
        } else if (format === DateTimeFormatWidth.ShortDateMediumTime) {
            format = this.paddedShortDateMediumTimeFormat;
        }
        if (value) {
            return new DatePipe(this._localeId).transform(value, format);
        }
        return '';
    }

    /**
     * Returns padded format for DateTimeFormatWidth.Short
     */
    public get paddedShortFormat(): string {
        if (DateFormatter._paddedFormats[DateTimeFormatWidth.Short] == undefined) {
            this.setPaddedShortFormat();
        }
        return DateFormatter._paddedFormats[DateTimeFormatWidth.Short];
    }

    private setPaddedShortFormat(): void {
        if (DateFormatter._paddedFormats[DateTimeFormatWidth.Short] == undefined) {
            DateFormatter._paddedFormats[DateTimeFormatWidth.Short] = `${this.padShortDateFormat(
                this._localeId
            )} ${this.padTimeFormat(this._localeId)}`;
        }
    }

    /**
     * Returns padded format for DateTimeFormatWidth.ShortDate
     */
    public get paddedShortDateFormat(): string {
        if (DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDate] == undefined) {
            this.setPaddedShortDateFormat();
        }
        return DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDate];
    }

    private setPaddedShortDateFormat(): void {
        DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDate] = this.padShortDateFormat(this._localeId);
    }

    /**
     * Returns padded format for DateTimeFormatWidth.ShortDateMediumTime
     */
    public get paddedShortDateMediumTimeFormat(): string {
        if (DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDateMediumTime] == undefined) {
            this.setPaddedShortDateMediumTimeFormat();
        }
        return DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDateMediumTime];
    }

    private setPaddedShortDateMediumTimeFormat(): void {
        if (DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDateMediumTime] == undefined) {
            DateFormatter._paddedFormats[DateTimeFormatWidth.ShortDateMediumTime] = `${this.padShortDateFormat(
                this._localeId
            )} ${this.padTimeFormat(this._localeId, 2)}`;
        }
    }

    /**
     * Fix inconsistent shortDate formats defined in some locales.
     * For example, for 'en-US' locale adjust shortDate format from 'm/d/yy' to 'mm/dd/yyyy'.
     */
    private padShortDateFormat(localeId: string): string {
        const YearLength = 4;
        const MonthLength = 2;
        const DayLength = 2;

        const format = this.dateFormatRetriever.getLocaleDateFormat(localeId, FormatWidth.Short);
        const dateFormatInfo = new ShortDateFormatInfo(format);

        if (dateFormatInfo.numberOfParts <= 1) return format;

        const paddedParts = dateFormatInfo.parts.map(part => {
            if (part.length > 0) {
                if (ShortDateFormatInfo.isYearPart(part)) {
                    return part.repeat(YearLength / part.length);
                } else if (ShortDateFormatInfo.isMonthPart(part)) {
                    return part.repeat(MonthLength / part.length);
                } else if (ShortDateFormatInfo.isDayPart(part)) {
                    return part.repeat(DayLength / part.length);
                }
            }
        });
        return paddedParts.join(dateFormatInfo.partSeparator);
    }

    /**
     * Fix inconsistent time formats defined in some locales.
     */
    private padTimeFormat(localeId: string, secondsLength: number = 0): string {
        const HoursLength = 1;
        const MinutesLength = 2;

        const format = this.dateFormatRetriever.getLocaleTimeFormat(localeId, FormatWidth.Medium);
        const timeFormatInfo = new TimeFormatInfo(format, secondsLength > 0);

        if (timeFormatInfo.numberOfParts <= 1) return format;

        const paddedParts = timeFormatInfo.parts.map(part => {
            if (part.length > 0) {
                if (TimeFormatInfo.isHoursPart(part)) {
                    return part.repeat(Math.ceil(HoursLength / part.length));
                } else if (TimeFormatInfo.isMinutesPart(part)) {
                    return part.repeat(MinutesLength / part.length);
                } else if (TimeFormatInfo.isSecondsPart(part)) {
                    return part.repeat(secondsLength / part.length);
                }
            }
        });

        return timeFormatInfo.is12HourFormat
            ? `${paddedParts.join(timeFormatInfo.partSeparator)}${TimeFormatInfo.hourFormat12}`
            : `${paddedParts.join(timeFormatInfo.partSeparator)}`;
    }
}
