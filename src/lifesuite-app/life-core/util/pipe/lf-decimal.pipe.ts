import { Pipe, PipeTransform } from '@angular/core';

import { DecimalFormatter } from 'life-core/util/formatter';

/*
 * Translate number object into locale-defined number format
 * Usage:
 *   value | lfDecimal:'digits'
*/
@Pipe({ name: 'lfDecimal' })
export class LfDecimalPipe implements PipeTransform {
    private _decimalFormatter: DecimalFormatter;

    constructor(decimalFormatter: DecimalFormatter) {
        this._decimalFormatter = decimalFormatter;
    }

    public transform(value: Number, digits?: string): string {
        if (value != null) {
            return this._decimalFormatter.format(value, digits);
        } else {
            return '';
        }
    }
}
