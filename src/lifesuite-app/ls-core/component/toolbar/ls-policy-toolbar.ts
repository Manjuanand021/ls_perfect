import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ViewValidationChannels } from 'life-core/view-model';
import { LfToolbar } from 'life-core/component/toolbar';

export const ToolbarPopoverDialogIds = {
    VALIDATION: 'validation'
};

@Component({
    selector: 'ls-policy-toolbar',
    templateUrl: '../../../life-core/component/toolbar/toolbar.html'
})
export class LsPolicyToolbar extends LfToolbar implements OnDestroy {
    private _messagingService: IMessagingService;
    private _messagingServiceSubscription: Subscription;

    constructor(messagingService: MessagingService) {
        super();
        this._messagingService = messagingService;
        this.setupSubscriptions();
    }

    private setupSubscriptions(): void {
        this._messagingServiceSubscription = this._messagingService.subscribe(
            ViewValidationChannels.RenderValidationMessages,
            () => this.renderValidationErrors()
        );
    }

    private renderValidationErrors(): void {
        // delaying intentionally to avoid closing popover
        // on clicking left navigation items which triggers outside popover click event inturn closes popover
        setTimeout(() => {
            const getPopoverDialogById = this.getPopoverDialogById(ToolbarPopoverDialogIds.VALIDATION);
            if(getPopoverDialogById) {
                getPopoverDialogById.open();
            }
            // this.getPopoverDialogById(ToolbarPopoverDialogIds.VALIDATION).open();
        });
    }

    public ngOnDestroy(): void {
        this._messagingServiceSubscription.unsubscribe();
    }
}
