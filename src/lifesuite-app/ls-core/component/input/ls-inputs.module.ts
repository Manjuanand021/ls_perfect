import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTaxIdConfig } from 'life-core/component/input';
import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';
import { LsInputDate } from './ls-inputdate';
import { LsInputDateCrypted } from './ls-inputdatecrypted';
import { LsInputTime } from './ls-inputtime';
import { LsInputPhone } from './ls-inputphone';
import { LsInputTaxIdConfig } from './ls-inputtaxid.config';
import { SettableContainerModule } from 'life-core/component/container/settable-container.module';

export const LS_INPUT_EXPORTS: Array<any> = [LsInputDate, LsInputTime, LsInputPhone, LsInputDateCrypted];

@NgModule({
    imports: [CommonModule, FormsModule, LfInputsModule, SettableContainerModule],
    declarations: [LsInputDate, LsInputDateCrypted, LsInputTime, LsInputPhone],
    providers: [{ provide: InputTaxIdConfig, useClass: LsInputTaxIdConfig }],
    exports: [...LS_INPUT_EXPORTS]
})
export class LsInputsModule {}
