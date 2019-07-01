import { Injectable } from '@angular/core';

import { NumberLocaleRetriever } from 'life-core/util';

@Injectable({
    providedIn: 'root'
})
export class InputNumberConfig {
    public numberLocale: string;

    constructor(numberLocaleRetriever: NumberLocaleRetriever) {
        this.numberLocale = numberLocaleRetriever.getNumberLocale();
    }
}
