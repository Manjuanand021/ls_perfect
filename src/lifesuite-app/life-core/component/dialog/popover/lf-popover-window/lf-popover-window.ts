/*
 * Adopted from NgbPopoverWindow in ng-bootstrap/src/popover/popover.ts
 */
import { Component, ElementRef, Renderer2, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Placement } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './lf-popover-window.html',
    styleUrls: ['./lf-popover-window.css'],
    host: {
        '[class]':
            '"popover bs-popover-" + placement.split("-")[0]+" bs-popover-" + placement + (popoverClass ? " " + popoverClass : "")',
        role: 'tooltip',
        '[id]': 'id'
    },
    encapsulation: ViewEncapsulation.None
})
export class LfPopoverWindow {
    @Input()
    placement: Placement = 'top';
    @Input()
    title: undefined | string | TemplateRef<any>;
    @Input()
    id: string;
    @Input()
    popoverClass: string;
    @Input()
    context: any;

    constructor(private _element: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

    isTitleTemplate() {
        return this.title instanceof TemplateRef;
    }

    applyPlacement(_placement: Placement) {
        // remove the current placement classes
        this._renderer.removeClass(
            this._element.nativeElement,
            'bs-popover-' + this.placement.toString().split('-')[0]
        );
        this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());

        // set the new placement classes
        this.placement = _placement;

        // apply the new placement
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
    }

    /**
     * Tells whether the event has been triggered from this component's subtree or not.
     *
     * @param event the event to check
     *
     * @return whether the event has been triggered from this component's subtree or not.
     */
    isEventFrom(event: Event): boolean {
        return this._element.nativeElement.contains(event.target as HTMLElement);
    }
}
