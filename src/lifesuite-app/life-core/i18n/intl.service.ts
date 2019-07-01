import { Injectable } from '@angular/core';
import { IntlService as KendoIntlService } from '@kendo/kendo-angular-intl';
import { DateFormatOptions, DateFormatNameOptions, NumberFormatOptions } from '@telerik/kendo-intl';

@Injectable()
export class IntlService implements KendoIntlService {
    private _intlImpl: KendoIntlService;

    constructor(intlImpl: KendoIntlService) {
        this._intlImpl = intlImpl;
    }

    /**
     * Locale ID accessor properties.
     *
     * @return - The locale ID.
     */
    public get localeId(): string {
        return (<any>this._intlImpl).localeId;
    }

    public set localeId(value: string) {
        (<any>this._intlImpl).localeId = value;
    }

    /**
     * Formats a string with placeholders such as
     * `Total amount {0:c}`.
     *
     * @param format - The format string.
     * @param values - One or more values to output in the format string placeholders.
     * @return - The formatted string.
     */
    public format(format: string, ...values: any[]): string {
        return this._intlImpl.format(format, values);
    }
    /**
     * Converts an object to a string based on the specified format.
     *
     * @param value - The value to format.
     * @param format - The format to use.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The formatted object.
     */
    public toString(value: any, format: string | any, localeId?: string): string {
        return this._intlImpl.toString(value, format, localeId);
    }
    /**
     * Converts a `Date` object to a string based on the specified format.
     * If no format is provided, the default short date format is used.
     *
     * @param value - The date to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The formatted date.
     */
    public formatDate(value: Date, format?: String | DateFormatOptions, localeId?: string): string {
        return this._intlImpl.formatDate(value, format, localeId);
    }
    /**
     * Returns the full format based on the `Date` object and the specified format.
     * If no format is provided, the default short date format is used.
     *
     * @param value - The date to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return - The full date format.
     */
    public dateFormatString(value: Date, format?: String | DateFormatOptions, localeId?: string): string {
        return this._intlImpl.dateFormatString(value, format, localeId);
    }
    /**
     * Converts a string to a `Date` object based on the specified format.
     *
     * @param value - The string to convert.
     * @param format - The format strings or options.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The parsed date.
     */
    public parseDate(
        value: string,
        format?: string | DateFormatOptions | string[] | DateFormatOptions[],
        localeId?: string
    ): Date {
        return this._intlImpl.parseDate(value, format, localeId);
    }
    /**
     * Converts a string to a `Number`.
     *
     * @param value - The string to convert.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The parsed number.
     */
    public parseNumber(value: string, format?: string | NumberFormatOptions, localeId?: string): number {
        return this._intlImpl.parseNumber(value, format, localeId);
    }
    /**
     * Converts a `Number` to a string based on the specified format.
     *
     * @param value - The number to format.
     * @param format - The format string or options.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The formatted number.
     */
    public formatNumber(value: number, format: string | NumberFormatOptions, localeId?: string): string {
        const valueToFormat = this.beforeFormatNumber(value, format);
        return this._intlImpl.formatNumber(valueToFormat, format, localeId);
    }

    /**
     * For percent format, adjusts number to compensate for standard percent format conversion
     * where number is multiplied by 100 to become percent.
     */
    private beforeFormatNumber(value: number, format: string | NumberFormatOptions): number {
        if (this.isPercentFormat(format)) {
            return value / 100;
        } else {
            return value;
        }
    }

    private isPercentFormat(format: string | NumberFormatOptions): boolean {
        const PercentFormatSpecifier = 'p';
        if (typeof format == 'string') {
            return (
                format.indexOf(PercentFormatSpecifier) >= 0 || format.indexOf(PercentFormatSpecifier.toUpperCase()) >= 0
            );
        } else {
            return format.style == 'precent';
        }
    }

    /**
     * Returns the day names from the current locale based on the option.
     *
     * @param options - Detailed configuration for the desired date format.
     * @param localeId - The locale ID to use in place of the default. Optional.
     * @return - The day names from the current locale based on the option.
     */
    public dateFormatNames(options: DateFormatNameOptions, localeId?: string): any {
        return this._intlImpl.dateFormatNames(options, localeId);
    }
    /**
     * Returns the number symbols from the current locale based on the option.
     *
     * @param localeId - The locale ID to use in place of the default one. Optional.
     * @return - The number symbols from the current locale.
     */
    public numberSymbols(localeId?: string): any {
        return this._intlImpl.numberSymbols(localeId);
    }
    /**
     * Returns the first day index starting from Sunday.
     *
     * @param localeId - The locale ID. Defaults to the current locale ID.
     * @return - The index of the first day of the week (0 == Sunday).
     */
    public firstDay(localeId?: string): number {
        return this._intlImpl.firstDay(localeId);
    }
}
