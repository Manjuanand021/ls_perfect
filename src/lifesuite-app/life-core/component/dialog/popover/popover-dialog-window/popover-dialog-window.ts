import {
    Component,
    Type,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    ElementRef,
    Renderer2,
    Input,
    TemplateRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Compose } from 'life-core/component/compose';
import { LangUtil } from 'life-core/util/lang';
import { PopoverDialog } from '../popover-dialog';
import { DialogButton, DialogButtonType } from '../../shared/dialog-button';
import {
    DialogData,
    DialogResult,
    DialogViewModelResult,
    IDialogViewModel,
    implementsDialogResultEventEmitter
} from '../../shared/dialog.interface';
import { LfPopoverWindow } from '../lf-popover-window/lf-popover-window';

@Component({
    templateUrl: './popover-dialog-window.html',
    styleUrls: ['./popover-dialog-window.css', '../../shared/dialog.css'],
    host: {
        '[class]':
            '"popover bs-popover-" + placement.split("-")[0]+" bs-popover-" + placement + (popoverClass ? " " + popoverClass : "")',
        role: 'tooltip',
        '[id]': 'id'
    }
})
export class PopoverDialogWindow extends LfPopoverWindow implements AfterViewInit, OnDestroy {
    public dialogRef: PopoverDialog;
    public view: Type<any>;
    public data: DialogData;
    public buttons: DialogButton[];
    private _dialogEventEmitterSubscription: Subscription;

    @Input()
    public title: undefined | string | TemplateRef<any>;

    @ViewChild(Compose)
    private refCompose: Compose;

    constructor(element: ElementRef<HTMLElement>, renderer: Renderer2) {
        super(element, renderer);
    }

    public onButtonClick(button: DialogButton): void {
        (<IDialogViewModel>this.refCompose.component).onDialogButtonClick(button.type).then(dialogViewModelResult => {
            this.handleDialogViewModelResult(dialogViewModelResult, button.handler, button);
        });
    }

    public ngAfterViewInit(): void {
        this.initSubscriptions();
    }

    public onCloseClick(): void {
        this.dialogRef.close(new DialogResult(DialogButtonType.DISMISS));
    }

    private initSubscriptions(): void {
        if (implementsDialogResultEventEmitter(this.refCompose.component)) {
            this._dialogEventEmitterSubscription = this.refCompose.component.dialogResultEventEmitter.subscribe(
                (result: DialogViewModelResult) => {
                    this.handleDialogViewModelResult(result, this.dialogRef.handler);
                }
            );
        }
    }

    private handleDialogViewModelResult(
        dialogViewModelResult: DialogViewModelResult,
        callbackHandler?: Function,
        button?: DialogButton
    ): void {
        if (!dialogViewModelResult) {
            dialogViewModelResult = new DialogViewModelResult();
        }
        const closeDialog: boolean = dialogViewModelResult.closeDialog === false ? false : true;
        const dialogDirty: boolean = !!dialogViewModelResult.dialogDirty;
        const dialogResult = new DialogResult(
            button ? button.type : '',
            dialogViewModelResult.returnValue,
            dialogDirty
        );
        if (callbackHandler) {
            this.invokeCallbackHandler(callbackHandler, dialogResult).then(() => {
                this.handleCloseDialog(closeDialog, dialogResult);
            });
        } else {
            this.handleCloseDialog(closeDialog, dialogResult);
        }
    }

    protected invokeCallbackHandler(callbackHandler: Function, returnValue: DialogResult): Promise<void> {
        if (LangUtil.isPromise(<any>callbackHandler)) {
            return callbackHandler(returnValue);
        } else {
            callbackHandler(returnValue);
            return Promise.resolve();
        }
    }

    private handleCloseDialog(closeDialog: boolean, dialogResult: DialogResult): void {
        if (closeDialog) {
            this.dialogRef.close(dialogResult);
        }
    }

    public ngOnDestroy(): void {
        if (this._dialogEventEmitterSubscription) {
            this._dialogEventEmitterSubscription.unsubscribe();
        }
    }
}
