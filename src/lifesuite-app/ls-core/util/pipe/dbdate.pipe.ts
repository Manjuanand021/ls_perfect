import { Pipe, PipeTransform } from '@angular/core';

import { DateFormatter, DateTimeFormatWidth } from 'life-core/util';

import { DBDate } from 'ls-core/model';
/*
 * Translate the DBDate into MM/dd/yyyy format
 * Usage:
 *   value | dbDate
*/
@Pipe({ name: 'dbDate' })
export class DBDatePipe implements PipeTransform {
    private _dateFormatter: DateFormatter;

    constructor(dateFormatter: DateFormatter) {
        this._dateFormatter = dateFormatter;
    }

    public transform(value: DBDate, formatter: string = DateTimeFormatWidth.ShortDate): string {
        if (value && value.dateAndTimeAsString) {
            return this._dateFormatter.format(value.dateAndTimeAsString, formatter);
        } else {
            return '';
        }
    }
}
