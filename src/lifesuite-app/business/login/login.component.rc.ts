import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';
import { Message, MessageSeverity } from 'life-core/component/shared';
import { RoutePath } from 'life-core/routing';
import { LoginErrorCodes } from './login-error-codes';

@Injectable()
export class LoginComponentResources {
    protected i18n: I18n;
    public logoutMessages: { readonly [key: string]: Message };
    public loginErrorMessages: { readonly [key: string]: Message };

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.setupMessages();
    }

    private setupMessages(): void {
        this.setupLogoutMessages();
        this.setupLoginErrorMessages();
    }

    private setupLogoutMessages(): void {
        this.logoutMessages = {
            [RoutePath.Logout]: new Message(
                this.i18n({ value: 'You have been successfully logged out.', id: 'logout.message.success' }),
                MessageSeverity.INFO
            ),
            [RoutePath.LogoutOnSessionTimeout]: new Message(
                this.i18n({
                    value: 'Your session has been closed due to inactivity.',
                    id: 'logout.message.sessiontimeout'
                }),
                MessageSeverity.INFO
            ),
            [RoutePath.LogoutOnUnauthorized]: new Message(
                this.i18n({ value: 'HTTP Error: Unauthorized (401).', id: 'logout.message.unauthorized' }),
                MessageSeverity.ERROR
            )
        };
    }

    private setupLoginErrorMessages(): void {
        this.loginErrorMessages = {
            [LoginErrorCodes.ACCOUNT_LOCKED]: new Message(
                this.i18n({
                    value: 'ACCOUNT IS LOCKED... SEE YOUR SYSTEM ADMINISTRATOR TO UNLOCK THIS ACCOUNT',
                    id: 'login.account.locked'
                }),
                MessageSeverity.ERROR
            ),
            [LoginErrorCodes.LOGIN_FAILED]: new Message(
                this.i18n({
                    value: 'INVALID LOGON INFORMATION...PLEASE RETRY',
                    id: 'login.credentials.invalid'
                }),
                MessageSeverity.ERROR
            )
        };
    }
}
