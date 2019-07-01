import { Injectable, Inject } from '@angular/core';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';

import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { toInteger, isNumber } from '@ng-bootstrap/ng-bootstrap/esm5/util/util';

import { LOCALE_ID } from 'life-core/i18n';
import { DateFormatter, ShortDateFormatInfo } from 'life-core/util/formatter';
import { LfInputDateConfig } from './lf-inputdate-config';

@Injectable()
export class LfDateParserFormatter extends NgbDateParserFormatter {
    private _localeId: string;
    private _dateFormatter: DateFormatter;
    private static dateFormatInfo: ShortDateFormatInfo;
    private _config: NgbDatepickerConfig;

    constructor(@Inject(LOCALE_ID) localeId: string, dateFormatter: DateFormatter, config: NgbDatepickerConfig) {
        super();
        this._localeId = localeId;
        this._dateFormatter = dateFormatter;
        this._config = config;
    }

    public parse(value: string): NgbDateStruct {
        const dateFormatInfo = this.getDateFormatInfo();
        if (value) {
            const dateParts = value.trim().split(dateFormatInfo.partSeparator);
            if (
                dateParts.length === dateFormatInfo.numberOfParts &&
                isNumber(dateParts[dateFormatInfo.indexPartMonth]) &&
                isNumber(dateParts[dateFormatInfo.indexPartDay]) &&
                isNumber(dateParts[dateFormatInfo.indexPartYear])
            ) {
                const yearValue = toInteger(dateParts[dateFormatInfo.indexPartYear]);
                return {
                    year: this.normalizeYearValue(yearValue),
                    month: toInteger(dateParts[dateFormatInfo.indexPartMonth]),
                    day: toInteger(dateParts[dateFormatInfo.indexPartDay])
                };
            }
        }
        return null;
    }

    public format(ngbDate: NgbDateStruct): string {
        if (ngbDate) {
            const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
            return this._dateFormatter.format(date);
        } else {
            return '';
        }
    }

    private getDateFormatInfo(): ShortDateFormatInfo {
        if (!LfDateParserFormatter.dateFormatInfo) {
            const dateFormat = getLocaleDateFormat(this._localeId, FormatWidth.Short);
            LfDateParserFormatter.dateFormatInfo = new ShortDateFormatInfo(dateFormat);
        }
        return LfDateParserFormatter.dateFormatInfo;
    }

    protected normalizeYearValue(year: number): number {
        return year < 100 ? this.convertToFullYear(year) : year;
    }

    protected convertToFullYear(shortYear: number): number {
        // convert two-digit short year to a four-digit full year, e.g., 10 -> 2010
        const currentCentury = 2000;
        const twoDigitYearMax = (<LfInputDateConfig>this._config).twoDigitYearMax;

        return currentCentury + shortYear <= twoDigitYearMax
            ? currentCentury + shortYear
            : currentCentury - 100 + shortYear;
    }
}
