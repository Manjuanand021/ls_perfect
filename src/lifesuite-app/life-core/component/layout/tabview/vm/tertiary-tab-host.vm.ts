import { Injector } from '@angular/core';

import { TabChannels } from '../messaging/tab-channels';
import { TabHostViewModel } from './tab-host.vm';

/**
 * Base ViewModel class for components hosting Tabs of the Tertiary (third nested level) TabView
 */
export abstract class TertiaryTabHostViewModel<TData = any> extends TabHostViewModel<TData> {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddTertiaryTab;
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetTertiaryTabData;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SaveTertiaryTab;
    }
}
