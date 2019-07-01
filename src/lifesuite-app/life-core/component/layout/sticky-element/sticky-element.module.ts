import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StickyElementDirective } from './sticky-element.directive';

export const STICKY_ELEMENT_EXPORTS: Array<any> = [StickyElementDirective];

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [StickyElementDirective],
    exports: [...STICKY_ELEMENT_EXPORTS],
    providers: []
})
export class StickyElementModule {}
