import { Component, Injector } from '@angular/core';

import { ParentChildRegistry, ViewModel, ViewValidationResult, ValidationRenderType } from 'life-core/view-model';
import {
    ICompose,
    IDialogViewModel,
    DialogViewModelResult,
    DialogButton,
    DialogButtonType,
    ConfirmDialog
} from 'life-core/component';
import { I18n } from 'life-core/i18n';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

@Component({
    selector: 'password-change',
    templateUrl: './password-change.component.html',
    providers: [ParentChildRegistry]
})
export class PasswordChangeComponent extends ViewModel implements ICompose, IDialogViewModel {
    public oldPassword: string;
    public newPassword: string;
    public confirmNewPassword: string;

    private _userName: string;
    private _dataService: DataService;
    private _confirmDialog: ConfirmDialog;

    constructor(injector: Injector, i18n: I18n, dataService: DataService, confirmDialog: ConfirmDialog) {
        super(injector);
        this._dataService = dataService;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
    }

    public setModel(model: any): void {
        this._userName = model.parameterData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.SAVE) {
            return this.validate().then(result => {
                if (result.isValid == ViewValidationResult.pass) {
                    return this.changePassword();
                } else {
                    this.showErrorMessage(result.message);
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    public validate(validationRenderType: ValidationRenderType = ValidationRenderType.ifNeeded): Promise<any> {
        return super.validate().then(result => {
            if (result == ViewValidationResult.pass) {
                return this.validatePassword();
            }
            return Promise.resolve(result);
        });
    }

    private validatePassword(): Promise<any> {
        if (this.oldPasswordHasWhiteSpaces()) {
            return Promise.resolve({
                isValid: ViewValidationResult.fail,
                message: this.i18n({
                    value: 'The old password must be entered',
                    id: 'passwordexpired.error.oldpasswordmustbeentered'
                })
            });
        }
        if (!this.newPasswordsMatch()) {
            return Promise.resolve({
                isValid: ViewValidationResult.fail,
                message: this.i18n({
                    value: 'The new passwords do not match',
                    id: 'passwordexpired.error.passwordsnotmatch'
                })
            });
        }
        if (this.newPasswordHasWhiteSpaces()) {
            return Promise.resolve({
                isValid: ViewValidationResult.fail,
                message: this.i18n({
                    value: 'The new password must be entered',
                    id: 'passwordexpired.error.newpasswordmustbeentered'
                })
            });
        } else {
            return Promise.resolve({ isValid: ViewValidationResult.pass });
        }
    }

    private oldPasswordHasWhiteSpaces(): boolean {
        return this.hasWhiteSpaces(this.oldPassword);
    }

    private newPasswordHasWhiteSpaces(): boolean {
        return this.hasWhiteSpaces(this.newPassword) || this.hasWhiteSpaces(this.confirmNewPassword);
    }

    private hasWhiteSpaces(password: string): boolean {
        return password === undefined || password === '' || password.indexOf(' ') >= 0;
    }

    private newPasswordsMatch(): boolean {
        return this.newPassword === this.confirmNewPassword;
    }

    private changePassword(): Promise<DialogViewModelResult> {
        const serviceParams: DataServiceParams = this.getChangePasswordServiceParams();
        return this._dataService.getData(serviceParams).then(changePasswordResponse => {
            if (changePasswordResponse.formattedErrors.length > 0) {
                this.showErrorMessage(changePasswordResponse.formattedErrors[0].formattedMessage);
                return new DialogViewModelResult(null, false);
            } else {
                return new DialogViewModelResult(new ChangePasswordResult(true, this.newPassword));
            }
        });
    }

    private getChangePasswordServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.CHANGE_PASSWORD_SERVICE,
            serviceMethod: UIServiceMethods.CHANGE_PASSWORD,
            requestPayload: this.getChangePasswordServicePayload()
        });
    }

    private getChangePasswordServicePayload(): ChangePasswordRequest {
        const request = new ChangePasswordRequest();
        request.loginName = this._userName;
        request.oldPassword = this.oldPassword;
        request.newPassword = this.newPassword;
        request.confirmPassword = this.confirmNewPassword;
        return request;
    }

    private showErrorMessage(errorMessage: string): void {
        this._confirmDialog.open({
            message: errorMessage,
            title: this.i18n({ value: 'Error', id: 'passwordexpired.error.dialog.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }
}

class ChangePasswordRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ChangePasswordRequest, LifeSuite.UIServiceDTO';

    public loginName: string;
    public oldPassword: string;
    public newPassword: string;
    public confirmPassword: string;
}

export class ChangePasswordResult {
    public success: boolean;
    public updatedPassword: string;
    constructor(success: boolean, updatedPassword: string) {
        this.success = success;
        this.updatedPassword = updatedPassword;
    }
}
