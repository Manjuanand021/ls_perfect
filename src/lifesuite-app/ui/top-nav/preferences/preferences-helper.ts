import { Injectable } from '@angular/core';

import { ResolvedDataNames } from 'life-core/view-model';
import {
    ModalDialog,
    DialogButton,
    DialogButtonType,
    DialogSize,
    DialogResult,
    ConfirmDialog
} from 'life-core/component/dialog';
import { IActionHandler } from 'life-core/handler';
import { OpenAppParams } from 'life-core/startup';
import { I18n } from 'life-core/i18n';
import { ILogger, Logger } from 'life-core/logging';
import { AppSession } from 'ls-core/session';

import { OpenAppHandler } from 'ui/startup/open-app.handler';

import { PreferencesComponent, PreferencesResult } from 'ui/top-nav/preferences/preferences.component';
import { PreferencesDataResolver } from 'ui/top-nav/preferences/preferences-data.resolver';
import { PreferenceLocalSettingsResolver } from './preference-local-settings.resolver';

@Injectable()
export class PreferencesHelper {
    private _modalDialog: ModalDialog;
    private _appSession: AppSession;
    private _confirmDialog: ConfirmDialog;
    private _openAppHandler: IActionHandler;
    private i18n: I18n;
    private _logger: ILogger;

    constructor(
        modalDialog: ModalDialog,
        appSession: AppSession,
        confirmDialog: ConfirmDialog,
        i18n: I18n,
        openAppHandler: OpenAppHandler,
        logger: Logger
    ) {
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._confirmDialog = confirmDialog;
        this._openAppHandler = openAppHandler;
        this.i18n = i18n;
        this._logger = logger;
    }

    public isOutOfOffice(): boolean {
        return this._appSession.user.OutOfOffice === -1 ? true : false;
    }

    public openPreferencesDialog(): void {
        this._modalDialog
            .open({
                view: PreferencesComponent,
                title: this.i18n({ value: 'Preferences', id: 'preferences.dialog.title' }),
                resolve: [
                    { resolveName: ResolvedDataNames.data, resolverClass: PreferencesDataResolver },
                    { resolveName: 'localSettings', resolverClass: PreferenceLocalSettingsResolver }
                ],
                buttons: [
                    new DialogButton({
                        type: DialogButtonType.SAVE,
                        handler: result => this.onPreferencesDialogClosed(result)
                    }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                size: DialogSize.large
            })
            .then(dialogRef => {
                dialogRef.result.then(result => this._logger.log('Modal dialog Result: ', result));
            });
    }

    public showOutOfOfficeConfirmDialog(): Promise<DialogResult> {
        if (this.isOutOfOffice()) {
            return this._confirmDialog.open({
                message: this.i18n({
                    value:
                        'You are currently set as Out of Office. Do you want to turn off the Out of Office option now?',
                    id: 'preferences.dialog.outofoffice.message'
                }),
                title: this.i18n({ value: 'Information', id: 'preferences.dialog.title' }),
                buttons: [
                    new DialogButton({
                        type: DialogButtonType.YES,
                        handler: () => {
                            this.openPreferencesDialog();
                            return;
                        }
                    }),
                    new DialogButton({ type: DialogButtonType.NO })
                ]
            });
        }
    }

    private onPreferencesDialogClosed(result: PreferencesResult): void {
        const needToReloadApp = result.languageChanged;
        if (needToReloadApp) {
            this.reloadApp();
        }
    }

    private reloadApp(): void {
        this.confirmAppReload().then(result => {
            const params = {
                context: {},
                newInstance: false
            } as OpenAppParams;
            this._openAppHandler.execute(params);
        });
    }

    private confirmAppReload(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Preferred Language has been changed. Application will now restart.',
                id: 'preferences.dialog.reload.message'
            }),
            title: this.i18n({ value: 'Information', id: 'preferences.dialog.title' }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK
                })
            ]
        });
    }
}
