import { Component } from '@angular/core';

import {
    ConfirmDialog,
    ModalDialog,
    DialogSize,
    DialogButton,
    DialogButtonType,
    PopoverDialogParams
} from 'life-core/component/dialog';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { ModalDialogDetail, PopoverDialogDetail } from './dialog-detail';

@Component({
    templateUrl: './test-dialog.html'
})
export class TestDialog {
    public componentPopoverParams: PopoverDialogParams = {
        content: PopoverDialogDetail,
        title: 'Component-based Popover',
        data: 'Some parameter data',
        resolve: [{ resolveName: 'metadataData', resolverClass: SampleDialogResolveData, context: 'Some context' }],
        buttons: [
            new DialogButton({
                type: DialogButtonType.OK,
                handler: () => {
                    this.log(DialogButtonType.OK);
                },
                options: { isDefault: true }
            })
        ]
    };

    public textPopoverParams: PopoverDialogParams = {
        content: 'Content of Text popover with params',
        title: 'Text Popover with params',
        autoClose: true
    };

    private _confirmDialog: ConfirmDialog;

    private _modalDialog: ModalDialog;

    constructor(confirmDialog: ConfirmDialog, modalDialog: ModalDialog) {
        this._confirmDialog = confirmDialog;
        this._modalDialog = modalDialog;
    }

    public showConfirmDialog() {
        this._confirmDialog
            .open({
                message: 'Do you want to delete this record?',
                title: 'Delete Confirmation',
                buttons: [
                    new DialogButton({
                        type: DialogButtonType.OK,
                        handler: () => {
                            this.log(DialogButtonType.OK);
                        }
                    }),
                    new DialogButton({
                        type: DialogButtonType.CANCEL,
                        handler: () => {
                            this.log(DialogButtonType.CANCEL);
                        },
                        options: { isDefault: true }
                    })
                ],
                size: DialogSize.small
            })
            .then(result => console.debug('Confirm Dialog Result: ', result));
    }

    private log(buttonType: string, result?: any): void {
        console.debug('Button ' + buttonType + ' is clicked; result: ', result);
    }

    public showModalDialog() {
        this._modalDialog
            .open({
                view: ModalDialogDetail,
                data: 'Some parameter data',
                resolve: [
                    { resolveName: 'metadataData', resolverClass: SampleDialogResolveData, context: 'Some context' }
                ],
                title: 'Dialog Detail',
                buttons: [
                    new DialogButton({
                        type: DialogButtonType.OK,
                        handler: result => {
                            this.log(DialogButtonType.OK, result);
                        }
                    }),
                    new DialogButton({
                        type: DialogButtonType.CANCEL,
                        handler: result => {
                            this.log(DialogButtonType.CANCEL, result);
                        },
                        options: { isDefault: true }
                    })
                ],
                size: DialogSize.large
            })
            .then(dialogRef => {
                dialogRef.result.then(result => console.debug('Modal dialog Result: ', result));
            });
    }
}

export class SampleDialogResolveData implements DirectDataResolverClass<string> {
    context: any;
    public directResolve(): Promise<string> {
        return Promise.resolve('Some resolved metadata');
    }
}
