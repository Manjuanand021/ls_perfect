import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LfPanel } from './lf-panel';

export const LF_PANEL_EXPORTS: Array<any> = [LfPanel];

@NgModule({
    imports: [CommonModule],
    declarations: [LfPanel],
    exports: [...LF_PANEL_EXPORTS]
})
export class LfPanelModule {}
