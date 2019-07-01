import { Component, Injectable, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { DialogButton, DialogButtonType } from '../shared/dialog-button';
import { DialogResult, DialogParams, DialogSize, DefaultDialogSize } from '../shared/dialog.interface';
import { DialogButtonLabels } from '../shared/dialog-button-labels';
import { DialogTracker } from '../shared/dialog-tracker';

@Component({
    templateUrl: './confirm-dialog.html',
    styleUrls: ['../shared/dialog.css']
})
export class ConfirmDialogContent {
    public title: string;
    public message: string;
    public buttons: DialogButton[];
    public closeDialogCallback: (dialogResult: DialogResult) => void;

    public onButtonClick(button: DialogButton): void {
        if (button.handler) {
            button.handler();
        }
        this.closeDialogCallback(new DialogResult(button.type));
    }

    public onCloseClick(): void {
        this.closeDialogCallback(new DialogResult(DialogButtonType.DISMISS));
    }
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialog implements OnDestroy {
    private _dialogService: NgbModal;
    private _dialogRef: NgbModalRef;
    private _dialogButtonLabels: DialogButtonLabels;
    private _dialogTracker: DialogTracker;

    constructor(dialogService: NgbModal, dialogButtonLabels: DialogButtonLabels, dialogTracker: DialogTracker) {
        this._dialogService = dialogService;
        this._dialogButtonLabels = dialogButtonLabels;
        this._dialogTracker = dialogTracker;
    }

    public open(params: ConfirmDialogParams): Promise<DialogResult> {
        const dialogOptions: NgbModalOptions = {
            backdrop: params.nonblocking ? true : 'static',
            centered: true
        };
        if (params.size != DefaultDialogSize) {
            dialogOptions.size = params.size;
        }
        this._dialogRef = this._dialogService.open(ConfirmDialogContent, dialogOptions);
        this.setupDialog(this._dialogRef, params.message, params.title, params.buttons);
        this._dialogTracker.onDialogOpened(this._dialogRef);
        return this._dialogRef.result;
    }

    private setupDialog(dialogRef: NgbModalRef, message: string, title?: string, buttons?: DialogButton[]): void {
        const dialog = dialogRef.componentInstance as ConfirmDialogContent;
        dialog.message = message;
        dialog.title = title;
        dialog.buttons = this.setupButtons(buttons);
        dialog.closeDialogCallback = (dialogResult: DialogResult) => {
            this.closeDialog(dialogResult);
        };
    }

    private setupButtons(buttons: DialogButton[]): DialogButton[] {
        for (const button of buttons) {
            this.setupButton(button);
        }
        return buttons;
    }

    private setupButton(button: DialogButton): void {
        if (!button.label) {
            button.label = this._dialogButtonLabels.byType[button.type];
        }
    }

    private closeDialog(dialogResult: DialogResult): void {
        this._dialogTracker.onDialogClosed(this._dialogRef);
        this._dialogRef.close(dialogResult);
    }

    public ngOnDestroy(): void {
        this._dialogRef = null;
    }
}

export interface ConfirmDialogParams extends DialogParams {
    size?: DialogSize;
    nonblocking?: boolean;
    message: string;
}
