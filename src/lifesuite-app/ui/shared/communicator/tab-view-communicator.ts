import { Injectable, OnDestroy } from '@angular/core';

import { MessagingService } from 'life-core/messaging';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { TabChannels, TabDescriptor } from 'life-core/component';

import { LeftNavChannels } from 'ui/left-nav';
import { TopNavChannels } from 'ui/top-nav';

@Injectable()
export class TabViewCommunicator implements OnDestroy {
    private _messagingService: MessagingService;
    private _subscriptionTracker: SubscriptionTracker;

    constructor(messagingService: MessagingService) {
        this._messagingService = messagingService;
        this._subscriptionTracker = new SubscriptionTracker();
        this.initSubscribers();
    }

    private initSubscribers(): void {
        this._subscriptionTracker.track(
            this._messagingService.subscribe(TabChannels.TabChanged, (tabData: TabDescriptor) => {
                this.updateLeftNavMenu(tabData);
                this.updateTopNavbar(tabData);
            })
        );
    }

    private updateLeftNavMenu(tabData: TabDescriptor): void {
        this._messagingService.publish(LeftNavChannels.UpdateLeftNavMenu, tabData);
    }

    private updateTopNavbar(tabData: TabDescriptor): void {
        this._messagingService.publish(TopNavChannels.UpdateTopNavbar, tabData);
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(LeftNavChannels.UpdateLeftNavMenu);
        this._messagingService.closeChannel(TopNavChannels.UpdateTopNavbar);
        this._subscriptionTracker.destroy();
    }
}
