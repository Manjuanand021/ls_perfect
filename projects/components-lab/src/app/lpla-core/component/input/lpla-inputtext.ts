import { Component, Input, forwardRef, SimpleChanges, SimpleChange } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { LfInputText, INPUT_HOST } from 'life-core/component/input';
import { FieldDescriptorBase } from 'lpla-core/field';

export const INPUTTEXT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LplaInputText),
    multi: true
};

@Component({
    selector: 'lpla-inputtext',
    templateUrl: '../../../../../../../src/lifesuite-app/life-core/component/input/inputtext/lf-inputtext.html',
    host: INPUT_HOST,
    providers: [INPUTTEXT_VALUE_ACCESSOR]
})
export class LplaInputText extends LfInputText {
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
