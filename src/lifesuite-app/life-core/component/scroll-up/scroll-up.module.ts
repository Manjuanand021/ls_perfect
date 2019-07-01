import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollUp } from './scroll-up';

export const SCROLLUP_EXPORTS: Array<any> = [ScrollUp];

@NgModule({
    imports: [CommonModule],
    declarations: [ScrollUp],
    exports: [...SCROLLUP_EXPORTS]
})
export class ScrollUpModule {}
