import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LfInputNumber } from './lf-inputnumber';

export const LF_INPUTNUMBER_EXPORTS: Array<any> = [LfInputNumber];

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [LfInputNumber],
    exports: [...LF_INPUTNUMBER_EXPORTS]
})
export class LfInputNumberModule {}
