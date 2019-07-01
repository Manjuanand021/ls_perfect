import { Component, forwardRef, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
// import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/esm5/datepicker/datepicker-service';

import { LfInputDate } from 'life-core/component/input';
import { RangeFieldDescriptor } from 'lpla-core/field';

const INPUTDATE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LplaInputDate),
    multi: true
};

const INPUTDATE_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LplaInputDate),
    multi: true
};

export const DATEPICKER_HOST: any = {
    '(keyup.esc)': 'close()'
};

@Component({
    selector: 'lpla-inputdate',
    templateUrl: '../../../../../../../src/lifesuite-app/life-core/component/input/inputdate/lf-inputdate.html',
    styleUrls: ['../../../../../../../src/lifesuite-app/life-core/component/input/inputdate/lf-inputdate.css'],
    host: DATEPICKER_HOST,
    providers: [
        INPUTDATE_VALUE_ACCESSOR,
        INPUTDATE_VALIDATOR
        //NgbDatepickerService
    ]
})
export class LplaInputDate extends LfInputDate {
    @Input('fieldModel')
    fieldModel: RangeFieldDescriptor<Date>;

    ngOnChanges(changes: SimpleChanges) {
        if ('fieldModel' in changes) {
            this.updateFieldModel(changes['fieldModel']);
        }
    }

    protected updateFieldModel(change: SimpleChange) {
        this.fieldModel = change.currentValue;
        this.disabled = !this.fieldModel.isAvailable || !this.fieldModel.isEditable;
        this.minDate = this.fieldModel.minValue;
        this.maxDate = this.fieldModel.maxValue;
    }
}
