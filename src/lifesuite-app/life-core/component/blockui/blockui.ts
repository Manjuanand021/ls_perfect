import { Component, ElementRef } from '@angular/core';

import { BlockUI as PrimeNgBlockUI } from 'primeng/blockui';
import { DomHandler } from 'primeng/components/dom/domhandler';

@Component({
    selector: 'block-ui',
    templateUrl: './blockui.html',
    providers: [DomHandler]
})
export class BlockUI extends PrimeNgBlockUI {
    constructor(el: ElementRef, domHandler: DomHandler) {
        super(el, domHandler);
    }
}
