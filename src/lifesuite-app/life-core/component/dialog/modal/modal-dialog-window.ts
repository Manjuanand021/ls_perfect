import { Component, Type, ViewChild, ViewEncapsulation, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';

import { Compose } from 'life-core/component/compose';
import { BrowserUtil, LangUtil } from 'life-core/util';
import {
    IDialogViewModel,
    DialogData,
    DialogResult,
    DialogViewModelResult,
    DialogButtonChangeEvent,
    implementsDialogButtonChangeEventEmitter
} from '../shared/dialog.interface';
import { DialogButton, DialogButtonType, DialogDragHandler, DialogMaximizeHandler } from '../shared';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';

export const MODAL_DIALOG_WINDOW_HOST: any = {
    '(keydown.backspace)': 'onBackSpaceKeyPressed($event)'
};

@Component({
    selector: 'modal-content',
    templateUrl: './modal-dialog-window.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../shared/dialog.css', 'modal-dialog-window.scss'],
    host: MODAL_DIALOG_WINDOW_HOST,
    providers: [DialogDragHandler, DialogMaximizeHandler]
})
export class ModalDialogWindow implements AfterViewInit, OnDestroy {
    public title: string;
    public view: Type<any>;
    public data: DialogData;
    public buttons: DialogButton[];
    public closeDialogCallback: (dialogResult: DialogResult) => void;
    public dialogDragHandler: DialogDragHandler;
    public dialogMaximizeHandler: DialogMaximizeHandler;
    public maximized: boolean = false;

    @ViewChild(Compose)
    protected refCompose: Compose;

    private _subscriptionTracker: SubscriptionTracker;

    constructor(dialogDragHandler: DialogDragHandler, dialogMaximizeHandler: DialogMaximizeHandler) {
        this._subscriptionTracker = new SubscriptionTracker();
        this.dialogDragHandler = dialogDragHandler;
        this.dialogMaximizeHandler = dialogMaximizeHandler;
        this._subscriptionTracker.track(
            this.dialogMaximizeHandler.maximizedChange.subscribe(value => this.onDialogMaximizedChange(value))
        );
    }

    public ngAfterViewInit(): void {
        this.subscribeToButtonChange();
    }

    public onBackSpaceKeyPressed(event: Event): void {
        BrowserUtil.supressEventInNonInputElement(event);
    }

    public onButtonClick(button: DialogButton): void {
        (<IDialogViewModel>this.contentComponent).onDialogButtonClick(button.type).then(dialogViewModelResult => {
            if (!dialogViewModelResult) {
                dialogViewModelResult = new DialogViewModelResult();
            }
            const closeDialog: boolean = dialogViewModelResult.closeDialog === false ? false : true;
            const dialogDirty: boolean = !!dialogViewModelResult.dialogDirty;
            const dialogResult = new DialogResult(button.type, dialogViewModelResult.returnValue, dialogDirty);
            if (button.handler) {
                this.invokeButtonHandler(button, dialogViewModelResult.returnValue, dialogResult).then(() => {
                    this.handleDialog(closeDialog, dialogResult);
                });
            } else {
                this.handleDialog(closeDialog, dialogResult);
            }
        });
    }

    private subscribeToButtonChange(): void {
        if (implementsDialogButtonChangeEventEmitter(this.contentComponent)) {
            this._subscriptionTracker.track(
                this.contentComponent.dialogButtonChangeEventEmitter.subscribe(event => {
                    this.updateButton(event);
                })
            );
        }
    }

    private updateButton(buttonChangeEvent: DialogButtonChangeEvent): void {
        const button = this.buttons.find(button => button.type == buttonChangeEvent.type);
        if (button) {
            if (buttonChangeEvent.disabled != undefined) {
                button.disabled = buttonChangeEvent.disabled;
            }
            if (buttonChangeEvent.hidden != undefined) {
                button.hidden = buttonChangeEvent.hidden;
            }
        }
    }

    protected handleDialog(closeDialog: boolean, dialogResult: DialogResult): void {
        if (closeDialog) {
            this.closeDialogCallback(dialogResult);
        }
    }

    public onCloseClick(): void {
        this.closeDialogCallback(new DialogResult(DialogButtonType.DISMISS));
    }

    public ngOnDestroy(): void {
        this.refCompose = null;
        this._subscriptionTracker.destroy();
    }

    protected invokeButtonHandler(button: DialogButton, returnValue: any, dialogResult?: DialogResult): Promise<void> {
        if (LangUtil.isPromise(<any>button.handler)) {
            return button.handler(returnValue, dialogResult);
        } else {
            button.handler(returnValue, dialogResult);
            return Promise.resolve();
        }
    }

    private get contentComponent(): any {
        return this.refCompose.component;
    }

    private onDialogMaximizedChange(value: boolean): void {
        this.maximized = value;
        this.dialogDragHandler.maximized = this.maximized;
    }
}
