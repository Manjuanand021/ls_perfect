import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { ConfirmDialog, DialogResult, DialogButton, DialogButtonType } from 'life-core/component/dialog';

import { UserDTO } from 'ls-core/model';
import { IIPObjectError } from 'ls-core/service';
import { LoginErrorCodes } from './login-error-codes';

@Injectable()
export class PasswordExpirationHandler {
    private _confirmDialog: ConfirmDialog;
    private i18n: I18n;

    constructor(confirmDialog: ConfirmDialog, i18n: I18n) {
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
    }

    public isPasswordExpired(error: IIPObjectError): boolean {
        return error && error.errorCodes[0] === LoginErrorCodes.MUST_CHANGE_PASSWORD;
    }

    public showPasswordExpirationMessage(error: any): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: error.formattedMessage,
            title: error.errorCodes[0],
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    public isPasswordAboutToExpire(user: UserDTO): boolean {
        return user.getPromptForPasswordChange > -1;
    }

    public showPasswordIsExpiringMessage(daysToExpire: number): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.getPasswordIsExpiringMessage(daysToExpire),
            title: this.i18n({ value: 'UnderwritingPro Password Expired', id: 'passwordexpired.popuptitle' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL })
            ]
        });
    }

    private getPasswordIsExpiringMessage(daysToExpire: number): string {
        return daysToExpire === 0
            ? this.i18n({
                  value:
                      'Your current UnderwritingPro password will expire today. Press OK to change your password, Cancel to continue working with UnderwritingPro.',
                  id: 'passwordexpired.changepassword.today'
              })
            : this.i18n(
                  {
                      value:
                          'Your current LifeSuite password will expire in {{daysToExpire}} days. Press OK to change your password, Cancel to continue working with LifeSuite.',
                      id: 'passwordexpired.changepassword.indays'
                  },
                  { daysToExpire: daysToExpire }
              );
    }
}
