import { Injectable } from '@angular/core';

import { ModalDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { PasswordChangeComponent } from './password-change.component';

@Injectable()
export class PasswordChangeHandler {
    private _modalDialog: ModalDialog;
    private i18n: I18n;

    constructor(modalDialog: ModalDialog, i18n: I18n) {
        this._modalDialog = modalDialog;
        this.i18n = i18n;
    }

    public changePassword(userName: string): Promise<any> {
        return this._modalDialog
            .open({
                view: PasswordChangeComponent,
                title: this.i18n({ value: 'UnderwritingPro Reset Password', id: 'passwordchange.popuptitle' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.SAVE }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                data: userName
            })
            .then(dialogRef => {
                return dialogRef.result.then(result => {
                    return result.buttonId == DialogButtonType.SAVE ? result.returnValue : null;
                });
            });
    }
}
