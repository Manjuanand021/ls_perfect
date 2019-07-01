import { Directive, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';

/**
 * Copy of splitGutter.directive.ts from 'angular-split' npm package
 * The class needs to be referenced to extend split component,
 * however 'angular-split' module doesn't export it and it's not part of
 * the distribution package.
 */
@Directive({
    selector: 'lf-split-gutter'
})
export class LfSplitGutterDirective implements OnDestroy {
    @Input()
    public set order(v: number) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
    }

    ////
    private _direction: 'vertical' | 'horizontal';

    @Input()
    public set direction(v: 'vertical' | 'horizontal') {
        this._direction = v;
        this.refreshStyle();
    }

    public get direction(): 'vertical' | 'horizontal' {
        return this._direction;
    }

    ////
    @Input()
    public set useTransition(v: boolean) {
        if (v) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', `flex-basis 0.3s`);
        } else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    }

    ////
    private _size: number;

    @Input()
    public set size(v: number) {
        this._size = v;
        this.refreshStyle();
    }

    public get size(): number {
        return this._size;
    }

    ////
    private _color: string;

    @Input()
    public set color(v: string) {
        this._color = v;
        this.refreshStyle();
    }

    public get color(): string {
        return this._color;
    }

    private _unregisterMouseListenersFn: Function;
    private _dragColor: string;

    @Input()
    public set dragColor(v: string) {
        this._dragColor = v;
        this.setMouseListeners();
    }

    public get dragColor(): string {
        return this._dragColor;
    }

    ////
    private _imageH: string;

    @Input()
    public set imageH(v: string) {
        this._imageH = v;
        this.refreshStyle();
    }

    public get imageH(): string {
        return this._imageH;
    }

    ////
    private _imageV: string;

    @Input()
    public set imageV(v: string) {
        this._imageV = v;
        this.refreshStyle();
    }

    public get imageV(): string {
        return this._imageV;
    }

    ////
    private _disabled: boolean = false;

    @Input()
    public set disabled(v: boolean) {
        this._disabled = v;
        this.refreshStyle();
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    ////
    private _minimized: boolean;

    @Input()
    public set minimized(v: boolean) {
        this._minimized = v;
        this.refreshStyle();
    }

    public get minimized(): boolean {
        return this._minimized;
    }

    ////
    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    public ngOnDestroy(): void {
        if (this._unregisterMouseListenersFn) this._unregisterMouseListenersFn();
    }

    private refreshStyle(): void {
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', `${this.size}px`);

        // fix safari bug about gutter height when direction is horizontal
        this.renderer.setStyle(
            this.elRef.nativeElement,
            'height',
            this.direction === 'vertical' ? `${this.size}px` : `100%`
        );

        this.setBackgroundColor(this.color);

        const state: 'disabled' | 'vertical' | 'horizontal' = this.disabled === true ? 'disabled' : this.direction;
        this.renderer.setStyle(this.elRef.nativeElement, 'background-image', this.getImage(state));
        this.renderer.setStyle(this.elRef.nativeElement, 'background-repeat', 'no-repeat');
        this.renderer.setStyle(this.elRef.nativeElement, 'background-position', 'center center');
        this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
    }

    private setMouseListeners(): void {
        const listeners = [];
        listeners.push(
            this.renderer.listen(this.elRef.nativeElement, 'mouseenter', event => {
                this.setBackgroundColor(this._dragColor);
            })
        );
        listeners.push(
            this.renderer.listen(this.elRef.nativeElement, 'mouseleave', event => {
                this.setBackgroundColor(this.color);
            })
        );
        this._unregisterMouseListenersFn = () => {
            listeners.forEach(unsubscribeFn => unsubscribeFn());
        };
    }

    private setBackgroundColor(color: string): void {
        const DefaultBackgroundColor = '#eeeeee';
        this.renderer.setStyle(
            this.elRef.nativeElement,
            'background-color',
            color !== '' ? color : DefaultBackgroundColor
        );
    }

    private getCursor(state: 'disabled' | 'vertical' | 'horizontal'): string {
        switch (state) {
            case 'horizontal':
                return 'col-resize';

            case 'vertical':
                return 'row-resize';

            case 'disabled':
                return 'default';
        }
    }

    private getImage(state: 'disabled' | 'vertical' | 'horizontal'): string {
        switch (state) {
            case 'horizontal':
                return this.imageH !== '' ? this.imageH : this.minimized ? defaultMinimizedImageH : defaultImageH;

            case 'vertical':
                return this.imageV !== '' ? this.imageV : this.minimized ? defaultMinimizedImageV : defaultImageV;

            case 'disabled':
                return '';
        }
    }
}

const defaultImageH =
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAABGCAYAAAAEo14nAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOvwAADr8BOAVTJAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAH9JREFUOE/d0EEKxDAMQ9EcPTdPq4CNrXzIPgVB9VwtZsacc/3PqNnoh8R6aBiHA5X7l4KGAYkVNjo8ivUPiXdGFQ8jzhFVPIw4R1TxMOIcUcXDiHNEFQ8jzhFVPIw4R1TxMOIcUcXzIMbvPtAPifXQMA4HKvcvBQ0DEiustcYHMFLd+Ec1kwcAAAAASUVORK5CYII=")';
const defaultImageV =
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAYAAABSIVz6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAAoSURBVChTY2hoaPgPwgxQQDc+TgkooDWf/oCQi2jGxykBBbThN/wHAKIhn8FY3p/+AAAAAElFTkSuQmCC")';
const defaultMinimizedImageH =
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAABGCAYAAAAEo14nAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOvgAADr4B6kKxwAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAKxJREFUOE/d1EEOgjAUhGHQKKw9iNETeAs3XqY3r28appbnfwJIhnS+8KCwYBqPWutUSmmnebMGxkvkbBixg3EHxpXwFrlm1D3f3o7xqe0I+z5dxhwQ/RFUvGZUyWHEcUSVHEYcR1TJYcRxRJUcRhxHVMlhxHFElRxGHEdUyWHEcUSVnANivOv978cSp1PkZWioIxaLoWEG4w6MeOUjMmfUD3DZHtjxI/jts9Qvt2miqxlK8uYAAAAASUVORK5CYII=")';
const defaultMinimizedImageV = defaultImageV;
