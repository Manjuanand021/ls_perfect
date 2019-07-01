import { Injector } from '@angular/core';

import { StatefulTabViewManager } from './stateful-tabview.manager';
import { TabChannels } from '../messaging/tab-channels';

/**
 *  TabViewManager class for Secondary (second nested level) components hosting TabView
 */
export class SecondaryTabViewManager extends StatefulTabViewManager {
    constructor(injector: Injector, tabViewId: string) {
        super(injector, tabViewId);
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetSecondaryTabData;
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddSecondaryTab;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SaveSecondaryTab;
    }

    protected get channel_SelectTab(): string {
        return TabChannels.SelectSecondaryTab;
    }

    protected needToNavigate(route: string): boolean {
        return true;
    }
}
