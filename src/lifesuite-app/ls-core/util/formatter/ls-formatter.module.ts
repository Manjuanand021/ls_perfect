import { NgModule } from '@angular/core';

import { DateFormatRetriever, NumberLocaleRetriever } from 'life-core/util/formatter';
import { LsDateFormatRetriever } from './ls-date-format-retriever';
import { LsNumberLocaleRetriever } from './ls-number-locale-retriever';

@NgModule({
    providers: [
        { provide: DateFormatRetriever, useClass: LsDateFormatRetriever },
        { provide: NumberLocaleRetriever, useClass: LsNumberLocaleRetriever }
    ]
})
export class LsFormatterModule {}
