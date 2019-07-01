import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { NumberLocaleRetriever } from './number-locale-retriever';
import { ValueFormatter } from './value.formatter';
import { LangUtil } from 'life-core/util/lang';

@Injectable({ providedIn: 'root' })
export class DecimalFormatter implements ValueFormatter {
    private localeId: string;

    constructor(numberLocaleRetriever: NumberLocaleRetriever) {
        this.localeId = numberLocaleRetriever.getNumberLocale();
    }

    public format(value: any, digits?: string): string {
        if (value != null || LangUtil.isNumber(value)) {
            return new DecimalPipe(this.localeId).transform(value, digits);
        }
        return '';
    }
}
