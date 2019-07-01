import { Injectable } from '@angular/core';
import { CurrencyPipe, getLocaleCurrencySymbol } from '@angular/common';

import { NumberLocaleRetriever } from './number-locale-retriever';
import { ValueFormatter } from './value.formatter';

@Injectable({ providedIn: 'root' })
export class CurrencyFormatter implements ValueFormatter {
    private localeId: string;

    constructor(numberLocaleRetriever: NumberLocaleRetriever) {
        this.localeId = numberLocaleRetriever.getNumberLocale();
    }

    public format(
        value: any,
        currencyCode: string = 'USD',
        display: CurrencySymbolDisplayType = 'symbol-narrow',
        digitsInfo: string = '1.0-0'
    ): string {
        if (value == null) {
            return '';
        }
        return new CurrencyPipe(this.localeId).transform(value, currencyCode, display, digitsInfo);
    }
}

export type CurrencySymbolDisplayType = 'code' | 'symbol' | 'symbol-narrow';
