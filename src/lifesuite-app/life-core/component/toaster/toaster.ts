import { Component, ElementRef, IterableDiffers, NgZone } from '@angular/core';

import { Growl } from 'primeng/growl';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'toaster',
    templateUrl: './toaster.html',
    styleUrls: ['./toaster.css'],
    providers: [DomHandler, MessageService]
})
export class Toaster extends Growl {
    constructor(
        el: ElementRef,
        domHandler: DomHandler,
        differs: IterableDiffers,
        messageService: MessageService,
        zone: NgZone
    ) {
        super(el, domHandler, differs, messageService, zone);
    }
}
