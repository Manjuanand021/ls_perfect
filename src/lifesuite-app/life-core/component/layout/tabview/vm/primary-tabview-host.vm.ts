import { TabViewHostViewModel } from './tabview-host.vm';
import { ITabViewManager } from '../manager/tabview.manager';
import { PrimaryTabViewManager } from '../manager/primary-tabview.manager';

/**
 * Base ViewModel class for components hosting Primary (main level) TabView
 */
export abstract class PrimaryTabViewHostViewModel extends TabViewHostViewModel {
    protected createTabViewManager(): ITabViewManager {
        return new PrimaryTabViewManager(this.injector, this.tabViewId);
    }
}
