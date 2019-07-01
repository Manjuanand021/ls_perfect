import { Directive, NgZone, ElementRef, Renderer2 } from '@angular/core';

import { SplitAreaDirective } from 'angular-split';

import { LfSplitComponent } from './lf-split.component';

@Directive({
    selector: 'lf-split-area'
})
export class LfSplitAreaDirective extends SplitAreaDirective {
    constructor(ngZone: NgZone, elRef: ElementRef, renderer: Renderer2, lfSplit: LfSplitComponent) {
        super(ngZone, elRef, renderer, lfSplit);
    }
}
