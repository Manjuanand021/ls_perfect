import { Injectable, Inject } from '@angular/core';
import { getLocaleMonthNames, getLocaleDayNames, FormStyle, TranslationWidth } from '@angular/common';

import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { LOCALE_ID } from 'life-core/i18n';

@Injectable()
export class LfInputDateI18n extends NgbDatepickerI18n {
    private _localeId: string;

    constructor(@Inject(LOCALE_ID) localeId: string) {
        super();
        this._localeId = localeId;
    }

    public getWeekdayShortName(weekday: number): string {
        const days = getLocaleDayNames(this._localeId, FormStyle.Standalone, TranslationWidth.Short);
        const Sunday = 7;
        return days[weekday == Sunday ? 0 : weekday];
    }

    public getMonthShortName(month: number): string {
        const months = getLocaleMonthNames(this._localeId, FormStyle.Standalone, TranslationWidth.Abbreviated);
        return months[month - 1];
    }

    public getMonthFullName(month: number): string {
        const months = getLocaleMonthNames(this._localeId, FormStyle.Standalone, TranslationWidth.Wide);
        return months[month - 1];
    }

    public getDayAriaLabel(date: NgbDateStruct): string {
        return '';
    }
}
