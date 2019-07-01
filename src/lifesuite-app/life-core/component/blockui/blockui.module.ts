import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockUI } from './blockui';

export const BLOCKUI_EXPORTS: Array<any> = [BlockUI];

@NgModule({
    imports: [CommonModule],
    declarations: [BlockUI],
    exports: [...BLOCKUI_EXPORTS]
})
export class BlockUIModule {}
