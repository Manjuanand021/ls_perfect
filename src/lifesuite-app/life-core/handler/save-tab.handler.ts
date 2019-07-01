import { Injectable, Injector } from '@angular/core';
import { DataSaveStatus } from 'life-core/handler/data-save-callback';
import { AppCloseChannel } from 'life-core/handler/application/close-app.interface';
import { IActionHandler } from 'life-core/handler/handler.interface';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { SaveAndCloseDataDelegate } from 'life-core/handler/save-and-close-data.delegate';
import { SaveDataDelegate, SaveDataCallback } from 'life-core/handler/save-data.delegate';
import { SaveTabDataContext } from 'life-core/component/layout/tabview/messaging/save-tab-channel-data';

@Injectable()
export class SaveTabHandler implements IActionHandler {
    protected _saveDataDelegate: SaveDataDelegate;
    protected _messagingService: IMessagingService;

    constructor(injector: Injector) {
        this._saveDataDelegate = injector.get(SaveAndCloseDataDelegate);
        this._messagingService = injector.get(MessagingService);
    }

    public execute(): void {
        this.saveData();
    }

    protected saveData(): void {
        const fn: SaveDataCallback = (saveStatus: DataSaveStatus) => {
            this.onDataSaved(saveStatus);
        };
        this._saveDataDelegate.saveData(fn, new SaveTabDataContext(true, true));
    }

    protected onDataSaved(saveStatus: DataSaveStatus): void {
        if (saveStatus == DataSaveStatus.failAndContinue) {
            this.onSaveFailed();
        } else if (saveStatus == DataSaveStatus.successNoNeedToSave) {
            this.onNoNeedToSave();
        } else if (saveStatus == DataSaveStatus.successDataSaved) {
            this.onSaveSucceed();
        } else {
            this.onSaveCancelled();
        }
    }

    protected onSaveSucceed(): void {}

    protected onNoNeedToSave(): void {}

    protected onSaveFailed(): void {
        this._messagingService.publish(AppCloseChannel.CancelClosingApplication);
    }

    protected onSaveCancelled(): void {}
}
