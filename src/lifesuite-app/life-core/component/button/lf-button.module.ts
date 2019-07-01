import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule, Button as PrimeNgButton } from 'primeng/button';

import { LfInfoDirective } from './lf-info.directive';
import { LfButton } from './lf-button';
import { LfInfoButton } from './lf-info-button';
import { LfSplitButton } from './lf-split-button';
import { LfSplitInfoButton } from './lf-split-infobutton';

export const LF_BUTTON_EXPORTS: Array<any> = [
    LfInfoDirective,
    LfButton,
    LfInfoButton,
    LfSplitButton,
    LfSplitInfoButton,
    PrimeNgButton
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule],
    declarations: [LfInfoDirective, LfButton, LfInfoButton, LfSplitButton, LfSplitInfoButton],
    exports: [...LF_BUTTON_EXPORTS]
})
export class LfButtonModule {}
