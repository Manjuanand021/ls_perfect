import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LifeError, IErrorHandler, ErrorHandlerChannels } from 'life-core/service';
import { MessagingService, BaseSubcriber } from 'life-core/messaging';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';

import { Logger, ILogger } from 'life-core/logging';
import { LogoutRedirectHandler } from 'ls-core/handler/logout/logout-redirect.handler';
import { LogoutReason } from 'ls-core/handler/logout/logout-reason';

@Injectable()
export class AuthorizationFailureErrorHandler extends BaseSubcriber implements IErrorHandler, OnDestroy {
    private _messagingService: MessagingService;
    private _messagingSubscription: Subscription;
    private _logoutRedirectHandler: LogoutRedirectHandler;
    private _confirmDialog: ConfirmDialog;
    private i18n: I18n;
    private _logger: ILogger;

    constructor(
        messagingService: MessagingService,
        logoutRedirectHandler: LogoutRedirectHandler,
        confirmDialog: ConfirmDialog,
        i18n: I18n,
        logger: Logger
    ) {
        super();
        this.i18n = i18n;
        this._messagingService = messagingService;
        this._logoutRedirectHandler = logoutRedirectHandler;
        this._confirmDialog = confirmDialog;
        this._logger = logger;
    }

    public register(): void {
        this._messagingSubscription = this._messagingService.subscribe2(
            ErrorHandlerChannels.HttpErrorUnauthorized,
            this
        );
    }

    public receive(payload: LifeError[]): void {
        this.handleError(payload);
    }

    public handleError(payload: LifeError[]): void {
        const errorMessage = this.getErrorMessage(payload);
        const handler = () => {
            this._logoutRedirectHandler.execute({ logoutReason: LogoutReason.HttpAuthorizationError });
        };
        this._confirmDialog.open({
            message: `Error: ${errorMessage}.<br>Click OK to continue.`,
            title: this.i18n({ value: 'Error', id: 'authfailure.error.title' }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    handler: handler
                })
            ]
        });
        this._logger.log('AuthorizationFailureErrorHandler', payload);
    }

    private getErrorMessage(errors: LifeError[]): string {
        const error = errors[0];
        const errorMessage = error
            ? `${error.errorMessage} (${error.errorCode})`
            : this.i18n({ value: 'Unspecified Error', id: 'authfailure.error.errormsg' });
        return errorMessage;
    }

    public filter(payload: any): boolean {
        return false;
    }

    public ngOnDestroy(): void {
        this._messagingSubscription.unsubscribe();
    }
}
