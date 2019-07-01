import { Injectable } from '@angular/core';

import { DateTimeFormatWidth, NameFormatter, NamePattern } from 'life-core/util/formatter';
import { DBDateFormatter } from 'ls-core/util/formatter';
import { TaxIdMaskPipe } from 'ls-core/util';

@Injectable({
    providedIn: 'root'
})
export class LsCellFormatters {
    private _dateFormatter: DBDateFormatter;
    private _nameFormatter: NameFormatter;
    private _taxIdMaskPipe: TaxIdMaskPipe;

    constructor(dateFormatter: DBDateFormatter, nameFormatter: NameFormatter, taxIdMaskPipe: TaxIdMaskPipe) {
        this._dateFormatter = dateFormatter;
        this._nameFormatter = nameFormatter;
        this._taxIdMaskPipe = taxIdMaskPipe;
    }

    public dateCellFormatter = (
        params: any,
        format: DateTimeFormatWidth | string = DateTimeFormatWidth.ShortDate
    ): string => {
        if (params.value && params.value.dateAndTimeAsString) {
            return this._dateFormatter.format(params.value, format);
        } else {
            return '';
        }
    };

    public taxIdFormatter = (params: any): string => {
        if (params.value) {
            return this._taxIdMaskPipe.transform(params.value);
        } else {
            return '';
        }
    };

    public nameCellFormatter = (params: any, pattern: NamePattern): string => {
        if (params.data) {
            return this._nameFormatter.format(
                pattern,
                params.data.FirstName,
                params.data.LastName,
                params.data.MiddleName,
                params.data.Title,
                params.data.Suffix
            );
        } else {
            return '';
        }
    };
}
