import { Injectable } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { NavigationTarget, INavigationSequence } from 'ls-core/model/auto-navigation';

/**
 * AutoNavigation Manager is responsible for:
 *  - registering/un registering with auto navigation channel;
 *  - going through navigation steps within auto navigation sequence;
 *
 */
@Injectable()
export class AutoNavigationManager {
    private _messagingService: IMessagingService;

    constructor(messagingService: MessagingService) {
        this._messagingService = messagingService;
    }

    /**
     * Registers navigator with auto navigation channel
     * @param callBack
     *
     */
    public registerWithNavigationChannel(channelId: string, callBack: any): void {
        this._messagingService.subscribeOnce(channelId, callBack);
    }

    /**
     * Un registers navigator with auto navigation channel
     * @param callBack
     *
     */
    public unregisterWithNavigationChannel(channelId: string): void {
        this._messagingService.closeChannel(channelId);
    }

    /**
     * Runs next navigation step from the auto-navigation sequence
     * by updating sequence and re-publishing it for the next navigation target.
     * This method may need to be called before the next target's mediator is instantiated,
     * so the mediator is notified with already updated navigation sequence.
     * @param sequence
     * @param processedNavigationTarget
     * @param channelId channelId for next navigation target or
     * channelId of previous navigation target which needs to be closed
     *
     */
    public continueNavigation(
        sequence: INavigationSequence,
        processedNavigationTarget: NavigationTarget,
        channelId: string
    ): void {
        sequence.removeNavigationTarget(processedNavigationTarget);
        // close previous navigation channel
        if (sequence.length === 0) {
            this.unregisterWithNavigationChannel(channelId);
        } else if (sequence.length > 0) {
            this._messagingService.publish(channelId, sequence.clone());
        }
    }
}
