import { Inject, Injectable } from '@angular/core';

import { LOCALE_ID } from 'life-core/i18n';

@Injectable()
export class NumberLocaleRetriever {
    protected localeId: string;
    constructor(@Inject(LOCALE_ID) localeId: string) {
        this.localeId = localeId;
    }

    public getNumberLocale(): string {
        return this.localeId;
    }
}
