import { Component, forwardRef, Provider, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
// import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/esm5/datepicker/datepicker-service';

import { DATEPICKER_HOST } from 'life-core/component/input';
import { SecureComponent } from 'life-core/component/authorization';
import { SettableContainerComponent } from 'life-core/component/container';
import { LangUtil } from 'life-core/util/lang';
import { DBDateUtil } from 'ls-core/util';
import { LsInputDate } from 'ls-core/component/input';

const INPUTDATE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LsInputDateCrypted),
    multi: true
};

const INPUTDATE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LsInputDateCrypted),
    multi: true
};

@Component({
    selector: 'ls-inputdatecrypted',
    templateUrl: '../../../life-core/component/input/inputdate/lf-inputdate.html',
    styleUrls: ['../../../life-core/component/input/inputdate/lf-inputdate.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: DATEPICKER_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTDATE_VALUE_ACCESSOR,
        INPUTDATE_VALIDATOR,
        { provide: SecureComponent, useExisting: forwardRef(() => LsInputDateCrypted) },
        { provide: SettableContainerComponent, useExisting: forwardRef(() => LsInputDateCrypted) }
    ]
})
export class LsInputDateCrypted extends LsInputDate {
    protected onChange(value: any): void {
        if (LangUtil.isDate(value)) {
            value = DBDateUtil.dateToDBDateCrypted(value, this.localeId);
        }
        this._onChange(value);
    }
}
