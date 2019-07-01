import { Injectable, Injector } from '@angular/core';

import { TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { LinkMenuData } from 'ui/left-nav';
import { LsTabDescriptorFactory } from 'ui/tabview';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabChannels } from 'life-core/component';

import { MenuActionHandler } from './menu-action.handler';

@Injectable()
export class ReassignCaseHandler extends MenuActionHandler {
    private _messagingService: IMessagingService;
    private _tabDescriptorFactory: LsTabDescriptorFactory;

    constructor(injector: Injector, messagingService: MessagingService, tabDescriptorFactory: TabDescriptorFactory) {
        super(injector);
        this._messagingService = messagingService;
        this._tabDescriptorFactory = tabDescriptorFactory as LsTabDescriptorFactory;
    }

    public execute(actionParams?: LinkMenuData): void {
        this.openReassignCaseTab();
    }

    private openReassignCaseTab(): void {
        const tabReassignCase = this._tabDescriptorFactory.createPrimaryTabDescriptorReassignCase();
        tabReassignCase.selected = true;
        this._messagingService.publish(TabChannels.AddPrimaryTab, tabReassignCase);
    }
}
