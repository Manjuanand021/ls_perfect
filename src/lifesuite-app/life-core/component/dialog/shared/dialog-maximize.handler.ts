import { ElementRef, EventEmitter, Injectable, Renderer2 } from '@angular/core';

import { DialogCoordinates } from './dialog-coordinates';
import { DialogUtil } from './dialog.util';
import { ClickEventResolver } from 'life-core/component/shared/event/click-event.resolver';

@Injectable()
export class DialogMaximizeHandler {
    public maximizedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _maximized: boolean = false;
    private _dialogElementRef: ElementRef<HTMLElement>;
    private _renderer: Renderer2;
    private _headerClickEventResolver: ClickEventResolver;
    private _dialogWindowElement: HTMLElement;
    private _centeredDialogCoordinates: DialogCoordinates;

    constructor(dialogElementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
        this._dialogElementRef = dialogElementRef;
        this._renderer = renderer;
        this.initHeaderClickEventResolver();
        this.initDialogInfo();
    }

    public onMaximizeClick(event: Event): void {
        this._maximized = !this._maximized;
        this.maximizeClickHandler(this._maximized);
        this.maximizedChange.emit(this._maximized);
    }

    public onHeaderClick(event: Event): void {
        this._headerClickEventResolver.onClick(event);
    }

    private initDialogInfo(): void {
        setTimeout(() => {
            this._dialogWindowElement = DialogUtil.getDialogWindowElement(this._dialogElementRef);
            this._centeredDialogCoordinates = DialogUtil.getDialogCoordinates(this._dialogWindowElement);
        }, 0);
    }

    private maximizeClickHandler(maximized: boolean): void {
        this.setDialogCoordinates(this._centeredDialogCoordinates);
        const cssClassMaximize = 'modal-adaptive';
        const dialogWindowElement = DialogUtil.getDialogWindowElement(this._dialogElementRef);
        maximized
            ? this._renderer.addClass(dialogWindowElement, cssClassMaximize)
            : this._renderer.removeClass(dialogWindowElement, cssClassMaximize);
    }

    private initHeaderClickEventResolver(): void {
        this._headerClickEventResolver = new ClickEventResolver(event => {}, event => this.onMaximizeClick(event));
    }

    private setDialogCoordinates(coordinates: DialogCoordinates): void {
        this._renderer.setStyle(this._dialogWindowElement, 'left', `${coordinates.left}px`);
        this._renderer.setStyle(this._dialogWindowElement, 'top', `${coordinates.top}px`);
    }
}
