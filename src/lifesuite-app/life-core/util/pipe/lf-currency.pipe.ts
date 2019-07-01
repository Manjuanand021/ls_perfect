import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyFormatter, CurrencySymbolDisplayType } from 'life-core/util/formatter';

/*
 * Translate currency object into locale-defined currency format
 * Usage:
 *   value | lfCurrency:'currencyCode':'symbolDisplay':digits'
*/
@Pipe({ name: 'lfCurrency' })
export class LfCurrencyPipe implements PipeTransform {
    private _currencyFormatter: CurrencyFormatter;

    constructor(currencyFormatter: CurrencyFormatter) {
        this._currencyFormatter = currencyFormatter;
    }

    public transform(
        value: Number,
        currencyCode?: string,
        symbolDisplay?: CurrencySymbolDisplayType,
        digits?: string
    ): string {
        if (value != null) {
            return this._currencyFormatter.format(value, currencyCode, symbolDisplay, digits);
        } else {
            return '';
        }
    }
}
