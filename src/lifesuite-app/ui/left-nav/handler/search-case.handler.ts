import { Injectable, Injector } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabChannels, TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from 'ui/tabview';

import { MenuActionHandler } from './menu-action.handler';
import { LinkMenuData } from 'ui/left-nav';

@Injectable()
export class SearchCaseHandler extends MenuActionHandler {
    private _messagingService: IMessagingService;
    private _tabDescriptorFactory: LsTabDescriptorFactory;

    constructor(injector: Injector, messagingService: MessagingService, tabDescriptorFactory: TabDescriptorFactory) {
        super(injector);
        this._messagingService = messagingService;
        this._tabDescriptorFactory = tabDescriptorFactory as LsTabDescriptorFactory;
    }

    public execute(actionParams?: LinkMenuData): void {
        this.openSearchTab();
    }

    private openSearchTab(): void {
        const tabSearch = this._tabDescriptorFactory.createPrimaryTabDescriptorSearch();
        tabSearch.selected = true;
        this._messagingService.publish(TabChannels.AddPrimaryTab, tabSearch);
    }
}
