import { Component, forwardRef, Provider, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
// import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/esm5/datepicker/datepicker-service';

import { LfInputDate, DATEPICKER_HOST, ValidationResult } from 'life-core/component/input';
import { SecureComponent } from 'life-core/component/authorization';
import { SettableContainerComponent } from 'life-core/component/container';
import { LangUtil } from 'life-core/util/lang';
import { DBDateUtil } from 'ls-core/util';

const INPUTDATE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LsInputDate),
    multi: true
};

const INPUTDATE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LsInputDate),
    multi: true
};

@Component({
    selector: 'ls-inputdate',
    templateUrl: '../../../life-core/component/input/inputdate/lf-inputdate.html',
    styleUrls: ['../../../life-core/component/input/inputdate/lf-inputdate.css'],
    host: DATEPICKER_HOST,
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTDATE_VALUE_ACCESSOR,
        INPUTDATE_VALIDATOR,
        // NgbDatepickerService,
        { provide: SecureComponent, useExisting: forwardRef(() => LsInputDate) },
        { provide: SettableContainerComponent, useExisting: forwardRef(() => LsInputDate) }
    ]
})
export class LsInputDate extends LfInputDate {
    public writeValue(value: any): void {
        value = value ? (LangUtil.isDate(value) ? value : DBDateUtil.serverDateTime(value)) : null;
        super.writeValue(value);
    }

    public validate(c: FormControl): ValidationResult {
        const dateValue = DBDateUtil.serverDateTime(c.value);
        return this.validateValue(c, dateValue);
    }

    protected onChange(value: any): void {
        if (LangUtil.isDate(value)) {
            value = DBDateUtil.dateToDBDate(value, this.localeId);
        }
        this._onChange(value);
    }
}
