import {
    Component,
    Input,
    forwardRef,
    ElementRef,
    Renderer,
    SimpleChanges,
    SimpleChange,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { LfInputNumber, INPUT_HOST, InputProperties, InputNumberConfig } from 'life-core/component/input';

import { IntlService } from 'life-core/i18n';
import { RangeFieldDescriptor } from 'lpla-core/field';

export const INPUTNUMBER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LplaInputNumber),
    multi: true
};

export const INPUTNUMBER_NG_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LplaInputNumber),
    multi: true
};

@Component({
    selector: 'lpla-inputnumber',
    templateUrl: '../../../../../../../src/lifesuite-app/life-core/component/input/inputnumber/lf-inputnumber.html',
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUTNUMBER_VALUE_ACCESSOR, INPUTNUMBER_NG_VALIDATORS]
})
export class LplaInputNumber extends LfInputNumber {
    constructor(
        config: InputNumberConfig,
        intl: IntlService,
        el: ElementRef,
        cdr: ChangeDetectorRef,
        renderer: Renderer
    ) {
        super(config, intl, el, cdr, renderer);
    }

    @Input()
    fieldModel: RangeFieldDescriptor<number>;

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (InputProperties.fieldModel in changes) {
            this.updateFieldModel(changes[InputProperties.fieldModel]);
        }
    }

    protected updateFieldModel(change: SimpleChange) {
        this.fieldModel = change.currentValue;
        this.disabled = !this.fieldModel.isAvailable || !this.fieldModel.isEditable;
        this.decimals = this.fieldModel.decimalPlaces;
        if (this.fieldModel.minValue) {
            this.min = this.fieldModel.minValue;
            this.updateMinValidator();
        }
        if (this.fieldModel.maxValue) {
            this.max = this.fieldModel.maxValue;
            this.updateMaxValidator();
        }
    }
}
