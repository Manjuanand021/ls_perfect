import { Pipe, PipeTransform } from '@angular/core';

import { DateFormatter, DateTimeFormatWidth } from 'life-core/util/formatter';

/*
 * Translate Date object into locale-defined date format
 * Usage:
 *   value | lfDate:'formatter'
*/
@Pipe({ name: 'lfDate' })
export class LfDatePipe implements PipeTransform {
    private _dateFormatter: DateFormatter;

    constructor(dateFormatter: DateFormatter) {
        this._dateFormatter = dateFormatter;
    }

    public transform(value: Date, formatter: string = DateTimeFormatWidth.ShortDate): string {
        if (value) {
            return this._dateFormatter.format(value, formatter);
        } else {
            return '';
        }
    }
}
