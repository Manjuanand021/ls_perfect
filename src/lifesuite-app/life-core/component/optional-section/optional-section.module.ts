import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComposeModule } from 'life-core/component/compose/compose.module';
import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { OptionalSection } from './optional-section';

export const OPTIONAL_SECTION_EXPORTS: Array<any> = [OptionalSection];

@NgModule({
    imports: [CommonModule, FormsModule, ComposeModule, LfButtonModule],
    declarations: [OptionalSection],
    exports: [...OPTIONAL_SECTION_EXPORTS, ...LF_BUTTON_EXPORTS]
})
export class OptionalSectionModule {}
