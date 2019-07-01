import { Component, Input, ElementRef, ChangeDetectorRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Router } from '@angular/router';

import { DomHandler } from 'primeng/components/dom/domhandler';

import { LfSplitButton } from './lf-split-button';
import { SplitButtonClickEvent } from './split-button.event';
import { MenuItem } from 'life-core/component/menu';

@Component({
    selector: 'lf-split-infobutton',
    templateUrl: './lf-split-infobutton.html',
    styleUrls: ['./lf-split-infobutton.css'],
    providers: [DomHandler],
    animations: [
        trigger('overlayAnimation', [
            state(
                'void',
                style({
                    transform: 'translateY(5%)',
                    opacity: 0
                })
            ),
            state(
                'visible',
                style({
                    transform: 'translateY(0)',
                    opacity: 1
                })
            ),
            transition('void => visible', animate('{{showTransitionParams}}')),
            transition('visible => void', animate('{{hideTransitionParams}}'))
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class LfSplitInfoButton extends LfSplitButton {
    @Input()
    public selected: boolean;

    constructor(
        public el: ElementRef,
        public domHandler: DomHandler,
        public renderer: Renderer2,
        public router: Router,
        public cd: ChangeDetectorRef
    ) {
        super(el, domHandler, renderer, router, cd);
    }

    public itemClick(event: Event, item: MenuItem): void {
        super.itemClick(event, item);
        if (item.disabled) {
            return;
        }
        this.selectedMenuItemId = item.id;
    }

    public onDefaultButtonClick(event: Event): void {
        this.onClick.emit(new SplitButtonClickEvent(event, this.id, this.selectedMenuItem));
    }
}
