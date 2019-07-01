import { compare, CompareResult } from 'life-core/util/lang';

export class DateUtil {
    public static isDateSet(date: Date): boolean {
        if (date) {
            // HTML5 Conversion: return function swvalue purely based on date value
            return true;
            // we will never use year 1 and it is what is set by weborb/flex
            // and it means it is not set
            // C01 - Looks like for empty dates in timezones later then server time (Server: Central, Client: Pacific)
            // date.fullYear = 0 thus this will return true allowing an empty date gets formatted and looking like this MM/DD/0
            // fullYearUTC property does not have that problem and always = 1
            /// return (date.fullYearUTC == 1)?
            /// 	false:
            /// 	true;
        } else {
            return false;
        }
    }

    /**
     *
     * @param date
     * @param time
     */
    public static appendTimeToDate(date: Date, time: Date): Date {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds(),
            time.getMilliseconds()
        );
    }

    public static dateToString(date: Date, stripTime: boolean = false): string {
        if (!date) {
            return null;
        }
        return stripTime
            ? DateUtil.sanitizeDateString(date.toLocaleDateString())
            : DateUtil.sanitizeDateString(date.toLocaleString());
    }

    public static stringToDate(dateString: string): Date {
        return dateString ? new Date(dateString) : null;
    }

    /**
     * removes the time portion from a date
     */
    public static truncateTimeFromDate(date: Date): Date {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    /**
     * removes unwanted special characters produced in IE
     * which causes date.toLocaleString() to return invalid date error
     * See this article: https://www.csgpro.com/blog/2016/08/a-bad-date-with-internet-explorer-11-trouble-with-new-unicode-characters-in-javascript-date-strings
     */
    public static sanitizeDateString(dateString: string): string {
        return dateString.replace(/[^ -~]/g, '');
    }

    public static compareDates(date1: Date, date2: Date): CompareResult {
        return compare<Date>(date1, date2);
    }
}
