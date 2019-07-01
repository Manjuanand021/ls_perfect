import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { WindowRef } from 'life-core/util/window';

@Directive({
    selector: '[stick]'
})
/**
 * Sticks component, e.g. top navigation header, at a fixed vertical position.
 */
export class StickyElementDirective {
    private _element: ElementRef<HTMLElement>;
    private _renderer: Renderer2;
    private _windowRef: WindowRef;

    private _minY: number = 100;
    private _className: string = 'stick';

    /**
     * Stick after minimum vertical scroll value; default value: 100px.
     */
    @Input()
    public set stickMin(minY: number) {
        this._minY = minY || this._minY;
    }

    /**
     * Stick css class; default value: 'stick'.
     */
    @Input()
    public set stickClass(className: string) {
        this._className = className || this._className;
    }

    // private get activeClassName(): string {
    //  return `${this._className}-active`;
    // }

    constructor(element: ElementRef<HTMLElement>, renderer: Renderer2, windowRef: WindowRef) {
        this._element = element;
        this._renderer = renderer;
        this._windowRef = windowRef;
    }

    @HostListener('window:scroll', ['$event'])
    public handleScrollEvent(e: Event): void {
        if (this._windowRef.window.pageYOffset > this._minY) {
            this._renderer.addClass(this._element.nativeElement, this._className);
        } else {
            this._renderer.removeClass(this._element.nativeElement, this._className);
        }
    }
}
