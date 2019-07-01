import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DialogCoordinates } from './dialog-coordinates';
import { ScreenCoordinates } from './screen-coordinates';
import { DialogUtil } from './dialog.util';

@Injectable()
export class DialogDragHandler {
    public maximized: boolean;
    private _dialogElementRef: ElementRef<HTMLElement>;
    private _renderer: Renderer2;
    private _dialogWindowElement: HTMLElement;
    private _modalDialogElement: HTMLElement;
    private _mouseCoordinates: ScreenCoordinates;
    private _dragging: boolean = false;

    constructor(dialogElementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
        this._dialogElementRef = dialogElementRef;
        this._renderer = renderer;
        this.initDialogInfo();
    }

    public onHeaderMouseDown(event: MouseEvent): void {
        if (!this.maximized) {
            this._dragging = true;
            this.updateMouseCoordinates(event);
        }
    }

    public onHeaderMouseUp(event: MouseEvent): void {
        this._dragging = false;
    }

    public onHeaderMouseLeave(event: MouseEvent): void {
        this._dragging = false;
    }

    public onDialogDragStart(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    public onDialogDrag(event: MouseEvent): void {
        if (this._dragging) {
            const currCoordinates = DialogUtil.getDialogCoordinates(this._dialogWindowElement);
            const newCoordinates = this.getNewDialogCoordinates(currCoordinates, event);
            if (DialogCoordinates.different(currCoordinates, newCoordinates)) {
                this.setDialogCoordinates(newCoordinates);
            }
            this.updateMouseCoordinates(event);
        }
    }

    private initDialogInfo(): void {
        setTimeout(() => {
            this._dialogWindowElement = DialogUtil.getDialogWindowElement(this._dialogElementRef);
            this._modalDialogElement = DialogUtil.getModalDialogElement(this._dialogElementRef);
        }, 0);
    }

    private setDialogCoordinates(coordinates: DialogCoordinates): void {
        const modalDialogRect = this._modalDialogElement.getBoundingClientRect();
        this._renderer.setStyle(this._dialogWindowElement, 'left', `${coordinates.left}px`);
        this._renderer.setStyle(this._dialogWindowElement, 'top', `${coordinates.top}px`);
        // Need to update 'width' to prevent dialog "shrinking" when dragged beyond the right screen border
        this._renderer.setStyle(this._modalDialogElement, 'width', `${modalDialogRect.width}px`);
        this._renderer.setStyle(this._modalDialogElement, 'height', `${modalDialogRect.height}px`);
    }

    private getNewDialogCoordinates(currentDialogCoord: DialogCoordinates, event: MouseEvent): DialogCoordinates {
        const modalDialogRect = this._modalDialogElement.getBoundingClientRect();
        const movementX = this.getMovementX(event);
        const movementY = this.getMovementY(event);
        const dialogChangeX = this.isMovementInRangeX(movementX, modalDialogRect) ? movementX : 0;
        const dialogChangeY = this.isMovementInRangeY(movementY, modalDialogRect) ? movementY : 0;
        const factorX = 1; // use factor > 1 to make horizontal dragging more responsive
        const factorY = 1; // use factor > 1 to make vertical dragging more responsive
        return new DialogCoordinates(
            currentDialogCoord.left + dialogChangeX * factorX,
            currentDialogCoord.top + dialogChangeY * factorY
        );
    }

    private isMovementInRangeX(movementX: number, dialogRect: ClientRect): boolean {
        return true;
        // Uncomment to restrict dragging dialog outside the screen boundaries
        // return (movementX > 0 && dialogRect.right < window.innerWidth) || (movementX < 0 && dialogRect.left > 0);
    }

    private isMovementInRangeY(movementY: number, dialogRect: ClientRect): boolean {
        return true;
        // Uncomment to restrict dragging dialog outside the screen boundaries
        // return (
        //     (movementY > 0 && dialogRect.bottom < window.innerHeight) || movementY < 0
        //     // TODO: find out why dialogRect.top doesn't return correct coordinate
        //     //(movementY < 0 && dialogRect.top > 0)
        // );
    }

    private updateMouseCoordinates(event: MouseEvent): void {
        this._mouseCoordinates = new ScreenCoordinates(event.screenX, event.screenY);
    }

    private getMovementX(event: MouseEvent): number {
        return event.screenX - this._mouseCoordinates.x;
    }

    private getMovementY(event: MouseEvent): number {
        return event.screenY - this._mouseCoordinates.y;
    }
}
