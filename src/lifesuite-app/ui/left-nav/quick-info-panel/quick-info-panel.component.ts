import { Component, Injector, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { TabDescriptor } from 'life-core/component';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { LeftNavChannels } from 'ui/left-nav';

@Component({
    selector: 'quick-info-panel',
    templateUrl: './quick-info-panel.component.html',
    styleUrls: ['./quick-info-panel.component.css'],
    providers: [ParentChildRegistry]
})
export class QuickInfoPanelComponent extends ViewModel implements OnDestroy {
    public displayPolicyQuickInfoPanel: boolean;
    private _messagingSubscription: Subscription;
    private _messagingService: IMessagingService;

    constructor(injector: Injector, private _cdr: ChangeDetectorRef, messagingService: MessagingService) {
        super(injector);
        this._messagingService = messagingService;
        this.setupSubscriptions();
    }

    private setupSubscriptions(): void {
        this._messagingSubscription = this._messagingService.subscribe(LeftNavChannels.UpdateLeftNavMenu, newTab =>
            this.togglePolicyQuickInfoPanel(newTab)
        );
    }

    private togglePolicyQuickInfoPanel(newTab: TabDescriptor): void {
        this.displayPolicyQuickInfoPanel = newTab.menuId == 'policy';
        this._cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this._messagingSubscription.unsubscribe();
    }
}
