import { Injectable } from '@angular/core';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class LfInputDateConfig extends NgbDatepickerConfig {
    /**
     * The last year of a 100-year range that can be represented by a 2-digit year.
     * This property allows a 2-digit year to be properly translated to a 4-digit year.
     * For example, if this property is set to 2029, the 100-year range is from 1930 to 2029.
     * Therefore, a 2-digit value of 30 is interpreted as 1930, while a 2-digit value of 29 is interpreted as 2029.
     */
    public twoDigitYearMax: number;

    constructor() {
        super();
        const Sunday = 7;
        this.firstDayOfWeek = Sunday;
        this.minDate = {
            year: 1900,
            month: 1,
            day: 1
        };
        this.maxDate = {
            year: 2200,
            month: 12,
            day: 31
        };
        this.twoDigitYearMax = this.getTwoDigitYearMax();
    }

    protected getTwoDigitYearMax(): number {
        return new Date().getFullYear();
    }
}
