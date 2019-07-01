import { Component, Injector, Input } from '@angular/core';

import { LoginRequest, LoginResponse, IAuthenticationService } from 'life-core/authentication';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import {
    IDialogViewModel,
    DialogData,
    DialogButtonType,
    DialogViewModelResult,
    DialogButtonBarChannels
} from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session/app-session';
import { AuthenticationService } from 'ls-core/authentication';

@Component({
    selector: 'session-timeout',
    templateUrl: './session-timeout.html',
    styleUrls: ['./session-timeout.css'],
    providers: [ParentChildRegistry]
})
export class SessionTimeOut extends ViewModel implements ICompose, IDialogViewModel {
    @Input() public data: any;
    public userName: string;
    public password: string;
    private _authService: IAuthenticationService;
    private _messagingService: IMessagingService;

    constructor(
        injector: Injector,
        authenticationService: AuthenticationService,
        messagingService: MessagingService,
        appSession: AppSession,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._authService = authenticationService;
        this._messagingService = messagingService;
        this.userName = appSession.userId;
    }

    public setModel(model: DialogData): void {
        this.data = model.parameterData;
    }

    public onPasswordEntered(): void {
        this._messagingService.publish(DialogButtonBarChannels.EmulateButtonClick, DialogButtonType.OK);
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.OK) {
            return this.validate().then(result => {
                return this.onValidate(result);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    protected onValidate(validationResult: ViewValidationResult): Promise<DialogViewModelResult> {
        if (validationResult == ViewValidationResult.pass) {
            return this.login().then(loginResult => {
                return new DialogViewModelResult(loginResult, loginResult);
            });
        } else {
            this.messages = [
                this.i18n({ value: 'Password required.', id: 'session.timeout.passwordrequired.message' })
            ];
            return Promise.resolve(new DialogViewModelResult(null, false));
        }
    }

    protected login(): Promise<boolean> {
        const loginRequest: LoginRequest = new LoginRequest(this.userName, this.password);
        return this._authService
            .login(loginRequest)
            .then(response => {
                const loginResponse = response.responsePayload as LoginResponse;
                // when login fails, loginResponse from BE is null
                const isAuthenticated: boolean = loginResponse != null && loginResponse.UserID != null;
                if (!isAuthenticated) {
                    this.messages = [
                        this.i18n({ value: 'Invalid Password.', id: 'session.timeout.invalidpassword.message' })
                    ];
                }
                return isAuthenticated;
            })
            .catch(error => {
                this.messages = [error];
                this.logger.error(`Session timout login error: ${error}`);
                return null;
            });
    }
}
