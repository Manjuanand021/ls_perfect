import { Injector } from '@angular/core';

import { TabChannels } from '../messaging/tab-channels';
import { TabHostViewModel } from './tab-host.vm';

/**
 * Base ViewModel class for components hosting Tabs of the Secondary (second nested level) TabView
 */
export abstract class SecondaryTabHostViewModel<TData = any> extends TabHostViewModel<TData> {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get channel_AddTab(): string {
        return TabChannels.AddSecondaryTab;
    }

    protected get channel_SetTabData(): string {
        return TabChannels.SetSecondaryTabData;
    }

    protected get channel_SaveTab(): string {
        return TabChannels.SaveSecondaryTab;
    }
}
