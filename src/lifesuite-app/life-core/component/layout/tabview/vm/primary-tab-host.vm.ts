import { Injector } from '@angular/core';

import { AppCloseChannel, DataSaveCallback, DataSaveStatus, AppCloseChannelDataContext } from 'life-core/handler';
import { ValidationRenderType } from 'life-core/view-model';
import { TabChannels } from '../messaging/tab-channels';
import { TabHostViewModel } from './tab-host.vm';
import { TabStateManager } from 'life-core/util';

/**
 * Base ViewModel class for components hosting Tabs of the Primary (main level) TabView
 */
export abstract class PrimaryTabHostViewModel extends TabHostViewModel {
    protected stateManager: TabStateManager;

    constructor(injector: Injector) {
        super(injector);
        this.stateManager = injector.get(TabStateManager);
        this.stateManager.initTabState(this.tabData);
    }

    protected setupSubscriptions(): void {
        super.setupSubscriptions();
        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(AppCloseChannel.CloseApplication, appCloseChannelContext =>
                this.onAppClose(appCloseChannelContext)
            )
        );
        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(AppCloseChannel.CancelClosingApplication, () =>
                this.onAppCloseCancelled()
            )
        );

        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(AppCloseChannel.SaveApplication, appCloseChannelContext =>
                this.onAppSave(appCloseChannelContext, false)
            )
        );

        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(AppCloseChannel.ByPassCloseGuard, () =>
                this.onAppByPassCloseGuard()
            )
        );
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddPrimaryTab;
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetPrimaryTabData;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SavePrimaryTab;
    }

    protected onViewModelInitialized(): void {
        super.onViewModelInitialized();
        this.messagingService.publish(TabChannels.TabChanged, this.tabData);
    }

    protected onAppByPassCloseGuard(): void {
        this.deactivating = true;
        this.resetDirtyFlag();
    }

    protected isDataSaveNeeded(): boolean {
        return false;
    }

    protected noNeedToSave(callback: DataSaveCallback): void {
        callback(DataSaveStatus.successNoNeedToSave);
    }

    protected onAppSave(appCloseChannelContext: AppCloseChannelDataContext, toClose: boolean): void {
        this.deactivating = true;
        if (!this.isDataSaveNeeded()) {
            this.noNeedToSave(appCloseChannelContext.callback);
        } else {
            this.saveTabData(
                appCloseChannelContext.callback,
                toClose ? ValidationRenderType.never : ValidationRenderType.ifNeeded,
                appCloseChannelContext.saveTabDataContext
            );
        }
    }

    public onAppClose(appCloseChannelContext: AppCloseChannelDataContext): void {
        this.onAppSave(appCloseChannelContext, true);
    }

    public onAppCloseCancelled(): void {
        this.deactivating = false;
    }
}
