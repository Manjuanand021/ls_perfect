import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';
import { LplaSelectModule, LPLA_SELECT_EXPORTS } from './dropdown/lpla-select.module';

import { LplaInputMask } from './lpla-inputmask';
import { LplaInputDate } from './lpla-inputdate';
import { LplaInputNumber } from './lpla-inputnumber';
import { LplaInputText } from './lpla-inputtext';

export const LPLA_INPUT_EXPORTS: Array<any> = [
    LplaInputMask,
    LplaInputDate,
    LplaInputNumber,
    LplaInputText,
    ...LPLA_SELECT_EXPORTS
];

@NgModule({
    imports: [CommonModule, FormsModule, LfInputsModule, LplaSelectModule],
    declarations: [LplaInputMask, LplaInputDate, LplaInputNumber, LplaInputText],
    exports: LPLA_INPUT_EXPORTS
})
export class LplaInputsModule {}
