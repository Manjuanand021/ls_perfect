import { Injector } from '@angular/core';

import { StatefulTabViewManager } from './stateful-tabview.manager';
import { TabChannels } from '../messaging/tab-channels';

/**
 *  TabViewManager class for Tertiary (third nested level) components hosting TabView
 */
export class TertiaryTabViewManager extends StatefulTabViewManager {
    constructor(injector: Injector, tabViewId: string) {
        super(injector, tabViewId);
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetTertiaryTabData;
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddTertiaryTab;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SaveTertiaryTab;
    }

    protected get channel_SelectTab(): string {
        return TabChannels.SelectTertiaryTab;
    }

    protected needToNavigate(route: string): boolean {
        return true;
    }
}
