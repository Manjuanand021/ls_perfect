import { Injectable } from '@angular/core';

import { DateFormatter, DateTimeFormatWidth, DecimalFormatter } from 'life-core/util/formatter';
import { CurrencyFormatter, CurrencySymbolDisplayType } from 'life-core/util/formatter/currency.formatter';
import { LangUtil } from 'life-core/util/lang';

/**
 * Cell formatter functions for ag-grid component
 */
@Injectable({
    providedIn: 'root'
})
export class CellFormatters {
    private _dateFormatter: DateFormatter;
    private _decimalFormatter: DecimalFormatter;
    private _currencyFormatter: CurrencyFormatter;

    constructor(
        dateFormatter: DateFormatter,
        decimalFormatter: DecimalFormatter,
        currencyFormatter: CurrencyFormatter
    ) {
        this._dateFormatter = dateFormatter;
        this._decimalFormatter = decimalFormatter;
        this._currencyFormatter = currencyFormatter;
    }

    public dateCellFormatter = (
        params: any,
        format: DateTimeFormatWidth | string = DateTimeFormatWidth.ShortDate
    ): string => {
        if (params.value) {
            return this._dateFormatter.format(params.value, format);
        } else {
            return '';
        }
    };

    public decimalCellFormatter = (params: any, digits?: string): string => {
        if (params.value || LangUtil.isNumber(params.value)) {
            return this._decimalFormatter.format(params.value, digits);
        } else {
            return '';
        }
    };

    public currencyCellFormatter = (
        params: any,
        currencyCode?: string,
        display?: CurrencySymbolDisplayType,
        digitsInfo?: string
    ): string => {
        return this._currencyFormatter.format(params.value, currencyCode, display, digitsInfo);
    };
}
