import { Injector } from '@angular/core';

import { ViewModel, ViewValidationResult, ValidationRenderType } from 'life-core/view-model';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { MessagingChannelUtil } from 'life-core/messaging/messaging-channel.util';
import { SaveDataResult, SaveDataContext } from 'life-core/service';
import { SaveTabChannelData, SaveTabDataContext } from '../messaging/save-tab-channel-data';
import { TabDescriptor } from '../model';
import { DataSaveCallback, DataSaveStatus } from 'life-core/handler';

/**
 * Base ViewModel class for components hosting individual Tabs
 */
export abstract class TabHostViewModel<TData = any> extends ViewModel<TData> {
    protected tabData: TabDescriptor;

    protected messagingService: IMessagingService;

    /**
     * Abstract ChannelId getter to add Tab
     */
    protected abstract get channel_AddTab(): string;

    /**
     * Abstract ChannelId getter to set Tab Id
     */
    protected abstract get channel_SetTabData(): string;

    /**
     * Abstract ChannelId getter to save Tab
     */
    protected abstract get channel_SaveTab(): string;

    constructor(injector: Injector) {
        super(injector);
        this.messagingService = injector.get(MessagingService);
        this.setupSubscriptions();
    }

    protected setupSubscriptions(): void {
        this.messagingService.subscribeExclusively(this.channel_SetTabData, (tabData: TabDescriptor) =>
            this.setTabData(tabData)
        );

        this.subscriptionTracker.track(
            this.messagingService.subscribe(
                MessagingChannelUtil.getDynamicChannelId(this.channel_SaveTab, this.tabData.compositeTabId.toString()),
                (data: SaveTabChannelData) =>
                    this.saveTabData(data.callback, ValidationRenderType.ifNeeded, data.context)
            )
        );
    }

    protected setTabData(tabData: TabDescriptor): void {
        this.logger.log(`Set Tab Id= ${tabData.compositeTabId}`);
        this.tabData = tabData;
    }

    protected saveTabData(
        onTabDataSaved: DataSaveCallback,
        validationRenderType: ValidationRenderType,
        context?: SaveTabDataContext
    ): void {
        this.validate(validationRenderType).then(validationResult => {
            if (validationResult == ViewValidationResult.pass) {
                this.saveData(new SaveDataContext(context.isNavigatingAway)).then(saveDataResult => {
                    if (saveDataResult == SaveDataResult.success) {
                        this.onSaveDataSucceeded(onTabDataSaved);
                    } else if (saveDataResult == SaveDataResult.noNeedToSave) {
                        this.onNoNeedToSaveData(onTabDataSaved);
                    } else {
                        this.onSaveDataFailed(onTabDataSaved);
                    }
                });
            } else {
                this.onValidationFailed(onTabDataSaved);
            }
        });
    }
    protected onSaveDataSucceeded(callback: DataSaveCallback): void {
        callback(DataSaveStatus.successDataSaved);
    }

    protected onValidationFailed(callback: DataSaveCallback): void {
        callback(DataSaveStatus.failToValidate);
    }

    protected onSaveDataFailed(callback: DataSaveCallback): void {
        callback(DataSaveStatus.failToSave);
    }
    protected onNoNeedToSaveData(callback: DataSaveCallback): void {
        callback(DataSaveStatus.successNoNeedToSave);
    }
}
