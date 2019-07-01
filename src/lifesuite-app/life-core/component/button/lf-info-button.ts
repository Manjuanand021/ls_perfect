import { Component, Input, ElementRef, Renderer2, ViewEncapsulation, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DomHandler } from 'primeng/components/dom/domhandler';

import { SecureComponent } from 'life-core/component/authorization';

import { LfButton } from './lf-button';
import { InfoButtonClickEvent } from './info-button.event';

@Component({
    selector: 'lf-info-button',
    templateUrl: './lf-info-button.html',
    styleUrls: ['./lf-info-button.css'],
    providers: [DomHandler, { provide: SecureComponent, useExisting: forwardRef(() => LfInfoButton) }],
    animations: [
        trigger('overlayState', [
            state(
                'hidden',
                style({
                    opacity: 0
                })
            ),
            state(
                'visible',
                style({
                    opacity: 1
                })
            ),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class LfInfoButton extends LfButton {
    @Input()
    public selected: boolean;

    @Input()
    public infoLabel: string;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) {
        super(el, domHandler);
    }

    public onDefaultButtonClick(event: Event): void {
        this.selected = true;
        this.onClick.emit(new InfoButtonClickEvent(event, this.id, this.infoLabel));
    }
}
