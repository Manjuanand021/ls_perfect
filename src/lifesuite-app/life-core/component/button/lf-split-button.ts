import { Component, Input, ElementRef, ChangeDetectorRef, Renderer2, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

import { SplitButton } from 'primeng/splitbutton';
import { DomHandler } from 'primeng/components/dom/domhandler';

import { MenuItem } from 'life-core/component/menu';

@Component({
    selector: 'lf-split-button',
    templateUrl: './lf-split-button.html',
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
    ]
})
export class LfSplitButton extends SplitButton {
    @Input()
    public id: string = '';

    @Input()
    public name: string;

    @Input()
    public title: string;

    @ViewChild('menubtn')
    public menuButton: HTMLButtonElement;

    private _selectedMenuItemId: string;

    public selectedMenuItem: MenuItem;

    constructor(
        public el: ElementRef,
        public domHandler: DomHandler,
        public renderer: Renderer2,
        public router: Router,
        public cd: ChangeDetectorRef
    ) {
        super(el, domHandler, renderer, router, cd);
    }

    // Override base class method to emit additional parameter 'id'
    public itemClick(event: Event, item: MenuItem): void {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                id: this.id,
                item: item
            });
        }

        // Custom change start
        // Replaced property menuVisible with overlayVisible
        this.overlayVisible = false;
        // Custom change end
    }

    @Input()
    public set selectedMenuItemId(id: string) {
        this._selectedMenuItemId = id;
        this.selectedMenuItem = this.model.find(menuItem => (<MenuItem>menuItem).id == id) as MenuItem;
    }

    public get selectedMenuItemId(): string {
        return this._selectedMenuItemId;
    }
}
