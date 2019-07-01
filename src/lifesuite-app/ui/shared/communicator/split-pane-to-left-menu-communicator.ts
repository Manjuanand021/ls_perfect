import { Injectable, OnDestroy } from '@angular/core';

import { MessagingService } from 'life-core/messaging';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { LfSplitPaneChannels } from 'life-core/component/layout/split/split-pane/lf-split-pane-channels';

import { LeftNavChannels } from 'ui/left-nav';

@Injectable()
export class SplitPaneToLeftMenuCommunicator implements OnDestroy {
    private _messagingService: MessagingService;
    private _subscriptionTracker: SubscriptionTracker;

    constructor(messagingService: MessagingService) {
        this._messagingService = messagingService;
        this._subscriptionTracker = new SubscriptionTracker();
        this.initSubscribers();
    }

    private initSubscribers(): void {
        this._subscriptionTracker.track([
            this._messagingService.subscribe(LfSplitPaneChannels.SplitPaneVisible, () => this.collapseLeftNav()),
            this._messagingService.subscribe(LfSplitPaneChannels.SplitPaneHidden, () => this.expandLeftNav())
        ]);
    }

    private collapseLeftNav(): void {
        this._messagingService.publish(LeftNavChannels.CollapseLeftNav);
    }

    private expandLeftNav(): void {
        this._messagingService.publish(LeftNavChannels.ExpandLeftNav);
    }

    public ngOnDestroy(): void {
        this._subscriptionTracker.destroy();
    }
}
