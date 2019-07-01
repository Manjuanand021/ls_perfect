import { Component, forwardRef, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { LfInputTime } from 'life-core/component/input';
import { SecureComponent } from 'life-core/component/authorization';
import { DBDate } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';

export const INPUTTIME_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LsInputTime),
    multi: true
};

@Component({
    selector: 'ls-inputtime',
    templateUrl: '../../../life-core/component/input/inputtime/lf-inputtime.html',
    styleUrls: ['../../../life-core/component/input/inputtime/lf-inputtime.css'],
    providers: [INPUTTIME_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LsInputTime) }]
})
export class LsInputTime extends LfInputTime {
    public writeValue(value: any): void {
        const dateValue = DBDateUtil.serverDateTime(value);
        super.writeValue(dateValue);
    }

    public onChange = (value: any) => {
        const dateValue: Date = value ? this.appendNgbTimeToDate(this.value, value) : null;
        const dbDateValue: DBDate = DBDateUtil.dateToDBDate(dateValue, this.localeId);
        this.onNgChange(dbDateValue);
    };
}
