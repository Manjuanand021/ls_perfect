import { NgModule, Component, forwardRef, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { FieldDescriptorBase } from 'lpla-core/field';
import { LfInputMask, INPUT_HOST, INPUTMASK_PROVIDERS } from 'life-core/component/input';

export const INPUTMASK_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LplaInputMask),
    multi: true
};

@Component({
    selector: 'lpla-inputmask',
    templateUrl: '../../../../../../../src/lifesuite-app/life-core/component/input/inputmask/lf-inputmask.html',
    host: INPUT_HOST,
    providers: [INPUTMASK_VALUE_ACCESSOR, ...INPUTMASK_PROVIDERS]
})
export class LplaInputMask extends LfInputMask {
    @Input('fieldModel')
    fieldModel: FieldDescriptorBase;

    ngOnChanges(changes: SimpleChanges) {
        if ('fieldModel' in changes) {
            this.updateFieldModel(changes['fieldModel']);
        }
    }

    protected updateFieldModel(change: SimpleChange) {
        this.fieldModel = change.currentValue;
        this.disabled = !this.fieldModel.isAvailable || !this.fieldModel.isEditable;
    }
}
