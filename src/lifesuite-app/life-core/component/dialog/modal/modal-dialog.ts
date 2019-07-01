import { Injectable, Injector, Type, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { DirectDataResolve, DirectResolvedData, resolveData } from 'life-core/component/shared';
import { DialogButton } from '../shared/dialog-button';
import { DialogButtonLabels } from '../shared/dialog-button-labels';
import { DialogData, DialogParams, DialogResult, DialogSize, DefaultDialogSize } from '../shared/dialog.interface';
import { DialogTracker } from '../shared/dialog-tracker';
import { ModalDialogWindow } from './modal-dialog-window';

@Injectable()
export class ModalDialog implements OnDestroy {
    private _injector: Injector;
    private _dialogService: NgbModal;
    private _dialogRef: NgbModalRef;
    private _dialogButtonLabels: DialogButtonLabels;
    private _dialogTracker: DialogTracker;

    constructor(
        injector: Injector,
        dialogService: NgbModal,
        dialogButtonLabels: DialogButtonLabels,
        dialogTracker: DialogTracker
    ) {
        this._injector = injector;
        this._dialogService = dialogService;
        this._dialogButtonLabels = dialogButtonLabels;
        this._dialogTracker = dialogTracker;
    }

    public open(params: ModalDialogParams): Promise<ModalRef> {
        if (params.resolve) {
            return resolveData(params.resolve, this._injector).then(resolvedData => {
                params.resolvedData = resolvedData;
                return this.openDialog(params);
            });
        } else {
            return Promise.resolve(this.openDialog(params));
        }
    }

    private openDialog(params: ModalDialogParams): ModalRef {
        const dialogOptions: NgbModalOptions = {
            backdrop: params.nonblocking ? true : 'static',
            backdropClass: 'lf-modal-dialog-backdrop',
            // Option 'centered' doesn't work in IE11 in @ng-bootstrap ver1.1.0
            // Opened issue with @ng-bootstrap:
            // https://github.com/ng-bootstrap/ng-bootstrap/issues/2456
            centered: true
        };
        if (params.size != DefaultDialogSize) {
            dialogOptions.size = params.size;
        }
        this._dialogRef = this._dialogService.open(ModalDialogWindow, dialogOptions);
        this.setupDialog(this._dialogRef, params);
        this._dialogTracker.onDialogOpened(this._dialogRef);
        return this._dialogRef;
    }

    private setupDialog(dialogRef: NgbModalRef, params: ModalDialogParams): void {
        const dialog = dialogRef.componentInstance as ModalDialogWindow;
        dialog.view = params.view;
        dialog.data = new DialogData(params.data, params.resolvedData);
        dialog.title = params.title;
        dialog.buttons = this.setupButtons(params.buttons);
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
        const parentDialogRef = this._dialogTracker.getParentDialog(this._dialogRef);
        this._dialogRef.close(dialogResult);
        this._dialogTracker.onDialogClosed(this._dialogRef);
        if (parentDialogRef) {
            this._dialogRef = parentDialogRef;
        }
    }

    public ngOnDestroy(): void {
        this._dialogRef = null;
    }
}

export interface ModalDialogParams extends DialogParams {
    size?: DialogSize;
    nonblocking?: boolean;
    view: Type<any>;
    data?: any;
    resolve?: Array<DirectDataResolve>;
    resolvedData?: DirectResolvedData;
}

export class ModalRef extends NgbModalRef {
    public result: Promise<DialogResult>;
}
