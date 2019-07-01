import { Injector, Injectable } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { SaveTabDataContext } from 'life-core/component/layout/tabview/messaging/save-tab-channel-data';
import { I18n } from 'life-core/i18n';

import { AppCloseChannel, AppCloseChannelDataContext } from './application/close-app.interface';
import { DataSaveStatus } from './data-save-callback';

@Injectable()
export class SaveDataDelegate {
    protected messagingService: IMessagingService;
    protected callback: SaveDataCallback;
    protected confirmDialog: ConfirmDialog;

    protected i18n: I18n;

    constructor(injector: Injector, i18n: I18n) {
        this.messagingService = injector.get(MessagingService);
        this.confirmDialog = injector.get(ConfirmDialog);
        this.i18n = i18n;
    }

    public saveData(callback: SaveDataCallback, saveTabDataContext: SaveTabDataContext): void {
        this.callback = callback;
        this.executeSaveData(saveTabDataContext);
    }

    protected executeSaveData(saveTabDataContext: SaveTabDataContext): void {
        const saveDataChannel = this.getSaveDataChannelName();
        if (this.messagingService.channelExist(saveDataChannel)) {
            this.messagingService.publish(
                this.getSaveDataChannelName(),
                new AppCloseChannelDataContext(saveTabDataContext, (result: DataSaveStatus) =>
                    this.onSaveAppResult(result)
                )
            );
        } else {
            this.onSaveAppResult(DataSaveStatus.successNoNeedToSave);
        }
    }

    protected onDataValidationFailed(): void {
        this.callback(DataSaveStatus.failToValidate);
    }

    protected getSaveDataChannelName(): string {
        return AppCloseChannel.SaveApplication;
    }
    protected onSaveAppResult(result: DataSaveStatus): void {
        if (result == DataSaveStatus.successDataSaved) {
            this.onDataSaved();
        } else if (result == DataSaveStatus.successNoNeedToSave) {
            this.dataNotSaved();
        } else if (result == DataSaveStatus.failToValidate) {
            this.onDataValidationFailed();
        } else {
            this.onDataSaveFailed();
        }
    }

    protected onDataSaved(): void {
        this.callback(DataSaveStatus.successDataSaved);
    }

    protected onDataSaveFailed(): void {
        this.displayFailWarningDialog();
    }

    protected displayFailWarningDialog(): void {
        this.confirmDialog
            .open({
                message: this.getWarningDialogMessage(),
                title: this.getWarningDialogTitle(),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                const isOK = result.buttonId == DialogButtonType.OK;
                if (isOK) {
                    this.continueOnFail();
                } else {
                    this.cancelOnFail();
                }
            });
    }

    protected getWarningDialogMessage(): string {
        return this.i18n({
            value: 'Saving data is failed. Do you want to discard the changes and continue?',
            id: 'saveclose.validation.fail.message'
        });
    }

    protected continueOnFail(): void {
        this.messagingService.publish(AppCloseChannel.ByPassCloseGuard);
        this.callback(DataSaveStatus.failAndContinue);
    }

    protected cancelOnFail(): void {
        this.messagingService.publish(AppCloseChannel.CancelClosingApplication);
        this.callback(DataSaveStatus.failAndCancel);
    }

    protected getWarningDialogTitle(): string {
        return this.i18n({ value: 'Warning', id: 'savedata.warning.title' });
    }

    protected dataNotSaved(): void {
        this.callback(DataSaveStatus.successNoNeedToSave);
    }

    protected getSaveFailWarningDialogMessage(): string {
        return this.i18n({ value: 'Saving data is failed. Click OK to continue.', id: 'savedata.warning.message' });
    }
}

export type SaveDataCallback = (dataSaveStatus: DataSaveStatus) => void;
