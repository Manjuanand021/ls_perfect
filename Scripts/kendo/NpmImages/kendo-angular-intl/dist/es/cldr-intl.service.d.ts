import { DateFormatOptions, DateFormatNameOptions, NumberFormatOptions } from '@telerik/kendo-intl';
import { IntlService } from './intl.service';
/**
 * The Internationalization service implemented by using
 * the CLDR Database via the `@telerik/kendo-intl` package.
 */
export declare class CldrIntlService implements IntlService {
    /**
     * The current locale ID.
     */
    localeId: string;
    /**
     * Creates a new instance of the service with the ID of the specified locale.
     *
     * Note that the parts of the locale ID can be separated by either `_` (underscore)
     * or `-` (dash).
     *
     * @param localeId - The default locale ID.
     */
    constructor(localeId: string);
    /**
     * Formats a string with placeholders such as
     * `Total amount {0:c}`.
     *
     * @param format - The format string.
     * @param values - One or more values to output in the format string placeholders.
     * @return - The formatted string.
     */
    format(format: string, ...values: any[]): string;
    /**
     * Converts an object to a string based on the specified format.
     *
     * @param value - The value to format.
     * @param format - The format to use.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return The formatted object.
     */
    toString(value: any, format: string | any, localeId?: string): string;
    /**
     * Converts a `Date` object to a string based on the specified format.
     * If no format is provided, the default short date format is used.
     *
     * @param value - The date to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return The formatted date.
     */
    formatDate(value: Date, format?: String | DateFormatOptions, localeId?: string): string;
    /**
     * Returns the full format based on the `Date` object and the specified format.
     * If no format is provided, the default short date format is used.
     *
     * @param value - The date to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return - The full date format.
     */
    dateFormatString(value: Date, format?: String | DateFormatOptions, localeId?: string): string;
    /**
     * Converts a string to a `Date` object based on the specified format.
     *
     * @param value - The string to convert.
     * @param format - The format strings or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return The parsed date.
     */
    parseDate(value: string, format?: string | DateFormatOptions | string[] | DateFormatOptions[], localeId?: string): Date;
    /**
     * Converts a string to a `Number`.
     *
     * @param value - The string to convert.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return The parsed number.
     */
    parseNumber(value: string, format?: string | NumberFormatOptions, localeId?: string): number;
    /**
     * Converts a `Number` to a string based on the specified format.
     *
     * @param value - The number to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return The formatted number.
     */
    formatNumber(value: number, format: string | NumberFormatOptions, localeId?: string): string;
    /**
     * Returns the date names from the current locale based on the option.
     *
     * The available type values are:
     * - `days`
     * - `daysPeriods`
     * - `months`
     * - `quarters`
     * - `eras`
     *
     * @param options - Detailed configuration for the desired date format.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return - The day names from the current locale based on the option.
     */
    dateFormatNames(options: DateFormatNameOptions, localeId?: string): any;
    /**
     * Returns the number symbols from the current locale based on the option.
     *
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return - The number symbols from the current locale.
     */
    numberSymbols(localeId?: string): any;
    /**
     * Returns the first day index starting from Sunday.
     *
     * @param localeId - The locale ID. Defaults to the current locale ID.
     * @return - The index of the first day of the week (0 == Sunday).
     */
    firstDay(localeId?: string): number;
}
