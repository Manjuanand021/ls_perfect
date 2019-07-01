import { Injectable } from '@angular/core';
import { DBDate } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';

@Injectable({
    providedIn: 'root'
})
export class LsCellComparators {
    public datetimeComparator = (date1: DBDate, date2: DBDate): number => {
        return DBDateUtil.compareDates(date1, date2);
    };
}
