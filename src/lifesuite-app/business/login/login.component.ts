import { Component, Injector, Injectable, Inject } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { LoginRequest, LoginResponse, IAuthenticationService } from 'life-core/authentication';
import { RoutePath } from 'life-core/routing';
import { AuthenticationService } from 'ls-core/authentication';
import { AppSession } from 'ls-core/session/app-session';
import { IUIResponse, IIPObjectError } from 'ls-core/service';
import { Message, MessageSeverity } from 'life-core/component/shared';
import { DialogButton, DialogButtonType, ConfirmDialog } from 'life-core/component/dialog';
import { UserDTO } from 'ls-core/model';

import { LoginUserResolver } from './login-user.resolver';
import { ForgotPasswordDelegate } from './forgot-password.delegate';
import { PasswordChangeHandler, ChangePasswordResult } from './password-change';
import { PasswordExpirationHandler } from './password-expiration.handler';
import { OpenAppLandingHandler } from './open-app-landing.handler';
import { OpenAppParams } from 'life-core/startup';
import { I18n, LOCALE_ID } from 'life-core/i18n';
import { UserLocale } from 'ls-core/i18n';
import { LoginComponentResources } from './login.component.rc';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [
        ParentChildRegistry,
        ForgotPasswordDelegate,
        PasswordChangeHandler,
        PasswordExpirationHandler,
        LoginComponentResources
    ]
})
@Injectable()
export class LoginComponent extends ViewModel {
    public title: string;
    public userName: string;
    public password: string;
    public saveLogin: boolean;
    public loginButtonLabel: string;
    public loginButtonEnabled: boolean;
    public busy: boolean = false;
    public isAuthenticated: boolean;
    public messages: Message[] = [];

    private _authService: IAuthenticationService;
    private _loginUserResolver: LoginUserResolver;
    private _appSession: AppSession;
    private _confirmDialog: ConfirmDialog;
    private _forgotPasswordDelegate: ForgotPasswordDelegate;
    private _passwordChangeHandler: PasswordChangeHandler;
    private _passwordExpirationHandler: PasswordExpirationHandler;
    private _userLocale: UserLocale;
    private _localeId: string;
    private _loginComponentResources: LoginComponentResources;

    constructor(
        injector: Injector,
        i18n: I18n,
        userLocale: UserLocale,
        @Inject(LOCALE_ID) localeId: string,
        loginComponentResources: LoginComponentResources,
        authenticationService: AuthenticationService,
        loginUserResolver: LoginUserResolver,
        appSession: AppSession,
        confirmDialog: ConfirmDialog,
        forgotPasswordDelegate: ForgotPasswordDelegate,
        passwordChangeHandler: PasswordChangeHandler,
        passwordExpirationHandler: PasswordExpirationHandler
    ) {
        super(injector);
        // init auth service for login
        this._authService = authenticationService;
        this._loginUserResolver = loginUserResolver;
        this._appSession = appSession;
        this._confirmDialog = confirmDialog;
        this._forgotPasswordDelegate = forgotPasswordDelegate;
        this._passwordChangeHandler = passwordChangeHandler;
        this._passwordExpirationHandler = passwordExpirationHandler;
        this.i18n = i18n;
        this._userLocale = userLocale;
        this._localeId = localeId;
        this._loginComponentResources = loginComponentResources;
    }

    protected setupData(): void {
        this.setDialogTitle();
        this.setBusy(false);
        this.setMessage();
    }

    public login(): void {
        this.setBusy(true);
        const loginRequest = this.getLoginRequest();
        this._authService
            .login(loginRequest)
            .then((response: IUIResponse) => {
                if (response.formattedErrors.length > 0) {
                    this.handleLoginError(response.formattedErrors[0]);
                } else {
                    const loginResponse = response.responsePayload as LoginResponse;
                    this.isAuthenticated = true;
                    this.continueLoginProcess(loginResponse);
                }
            })
            .catch(error => {
                // show error message
                this.isAuthenticated = false;
                this.messages = [new Message(error.statusText, MessageSeverity.ERROR)];
                this.setBusy(false);
                this.logger.error(`Login -> login error: ${error}`);
            });
    }

    private getLoginRequest(): LoginRequest {
        // needed to fix IE specific issue
        this.userName = this.userName ? this.userName : undefined;
        this.password = this.password ? this.password : undefined;
        return new LoginRequest(this.userName, this.password);
    }

    private handleLoginError(error: IIPObjectError): void {
        if (this._passwordExpirationHandler.isPasswordExpired(error)) {
            this.handleExpiredPassword(error);
            this.setBusy(false);
        } else {
            this.isAuthenticated = false;
            this.showLoginErrorMessage(error);
        }
    }

    private handleExpiredPassword(error: any): void {
        this._passwordExpirationHandler.showPasswordExpirationMessage(error).then(dialogResult => {
            if (dialogResult.buttonId === DialogButtonType.OK) {
                this.processChangePassword();
            }
        });
    }

    private showLoginErrorMessage(error: IIPObjectError): void {
        if (this._loginComponentResources.loginErrorMessages[error.errorCodes[0]]) {
            const errorMessage = this._loginComponentResources.loginErrorMessages[error.errorCodes[0]];
            this.messages = [errorMessage];
            this.setBusy(false);
        }
    }

    private continueLoginProcess(loginResponse: LoginResponse): void {
        if (this.saveLogin) {
            this.saveLoginName();
        }
        this.getUserData(loginResponse).then(user => {
            if (this._passwordExpirationHandler.isPasswordAboutToExpire(user)) {
                this.handleExpiringPassword(user);
                this.setBusy(false);
            } else {
                this.navigateToApplication(user);
            }
        });
    }

    private saveLoginName(): void {
        // TODO: save user login in browser
    }

    protected getUserData(loginResponse: LoginResponse): Promise<any> {
        this._appSession.userId = loginResponse.LoginName;
        this._appSession.sessionTimeoutMinutes = loginResponse.SessionTimeoutMinutes;
        return this._loginUserResolver.directResolve();
    }

    private handleExpiringPassword(user: UserDTO): void {
        this._passwordExpirationHandler
            .showPasswordIsExpiringMessage(user.getPromptForPasswordChange)
            .then(dialogResult => {
                if (dialogResult.buttonId === DialogButtonType.OK) {
                    this.processChangePassword(user);
                } else {
                    this.navigateToApplication(user);
                }
            });
    }

    private navigateToApplication(user: UserDTO): void {
        if (this.needToChangeLocale(user)) {
            const openAppLandingHandler = this.injector.get(OpenAppLandingHandler);
            // TODO: add 'fromLogin' flag to tell AppInitializeService to bypass SSOLogin checks.
            // This is currently done by passing userId via StartupContext.
            const params: OpenAppParams = { newInstance: false };
            // Do redirect to reload Angular in case Login locale is different from App locale
            openAppLandingHandler.execute(params);
        } else {
            this.routerAccessor.navigateByUrl(RoutePath.App);
        }
    }

    private needToChangeLocale(user: UserDTO): boolean {
        return this._localeId != this._userLocale.getUserLocaleId(user);
    }

    private setDialogTitle(): void {
        this.title = this.i18n({ value: 'Login', id: 'login.dialog.title' });
    }

    private setBusy(isInProgress: boolean): void {
        this.loginButtonLabel = isInProgress
            ? this.i18n({ value: 'Please wait...', id: 'login.button.wait' })
            : this.i18n({ value: 'Login', id: 'login.button.login' });
        this.loginButtonEnabled = !isInProgress;
    }

    private setMessage(): void {
        const message = this._loginComponentResources.logoutMessages[this.routerAccessor.getRoutePath()];
        if (message) {
            this.messages.push(message);
        }
    }

    public onChangePasswordClick(event: any): void {
        if (!this.userName) {
            this.showUserNameMissingMessage();
        } else {
            this.processChangePassword();
        }
    }

    private showUserNameMissingMessage(): void {
        this._confirmDialog.open({
            message: this.i18n({ value: 'Please provide user name.', id: 'login.message.nousername' }),
            title: this.i18n({ value: 'Error', id: 'dialog.title.error' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private processChangePassword(user?: UserDTO): void {
        this._passwordChangeHandler.changePassword(this.userName).then(result => this.onPasswordChanged(result, user));
    }

    private onPasswordChanged(result: ChangePasswordResult, user?: UserDTO): void {
        if (result && result.success) {
            this.password = result.updatedPassword;
            this._appSession.resetUser();
            this.login();
        } else if (user) {
            this.navigateToApplication(user);
        }
    }

    public onForgotPasswordClick(event: Event): void {
        this._forgotPasswordDelegate.execute(this.userName);
    }
}
