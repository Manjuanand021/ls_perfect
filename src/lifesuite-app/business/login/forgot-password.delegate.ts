import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';

import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { LoginRequest } from 'life-core/authentication';

@Injectable()
export class ForgotPasswordDelegate {
    private _dataService: DataService;
    private _confirmDialog: ConfirmDialog;
    private i18n: I18n;

    constructor(i18n: I18n, dataService: DataService, confirmDialog: ConfirmDialog) {
        this._dataService = dataService;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
    }
    public execute(userName: string): Promise<boolean> {
        const serviceParams: DataServiceParams = this.getForgotPasswordServiceParams(userName);
        return this._dataService.getData(serviceParams).then(response => {
            if (response.formattedErrors.length > 0) {
                this.showErrorMessage(response.formattedErrors[0].formattedMessage);
                return Promise.resolve(false);
            }
            this.showRandomPasswordGeneratedMessage();
            return Promise.resolve(true);
        });
    }

    private getForgotPasswordServiceParams(userName: string): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.FORGOT_PASSWORD_SERVICE,
            serviceMethod: UIServiceMethods.FORGOT_PASSWORD,
            requestPayload: this.getForgotPasswordServicePayload(userName)
        });
    }

    private getForgotPasswordServicePayload(userName: string): LoginRequest {
        const request = new LoginRequest(userName, '');
        return request;
    }

    private showErrorMessage(errorMessage: string): void {
        this._confirmDialog.open({
            message: errorMessage,
            title: this.i18n({ value: 'Error', id: 'dialog.title.error' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private showRandomPasswordGeneratedMessage(): void {
        this._confirmDialog.open({
            message: this.i18n({
                value:
                    'Your UserName has been verified in UnderwritingPro Security. An email has been sent to you, at the email address we have on file, containing a temporary password. Please check your email account and log back into UnderwritingPro using the temporary password. You will be asked to reset your password at that time.',
                id: 'login.pwdgenmsg.message'
            }),
            title: this.i18n({ value: 'UnderwritingPro password Recovery', id: 'login.pwdgenmsg.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }
}
