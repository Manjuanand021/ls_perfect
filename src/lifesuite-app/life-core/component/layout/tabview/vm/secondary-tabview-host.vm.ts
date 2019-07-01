import { TabViewHostViewModel } from './tabview-host.vm';
import { ITabViewManager } from '../manager/tabview.manager';
import { IStatefulTabViewManager } from '../manager/stateful-tabview.manager';
import { SecondaryTabViewManager } from '../manager/secondary-tabview.manager';

/**
 * Base ViewModel class for components hosting Secondary (second nested level) TabView
 */
export abstract class SecondaryTabViewHostViewModel extends TabViewHostViewModel {
    protected createTabViewManager(): ITabViewManager {
        return new SecondaryTabViewManager(this.injector, this.tabViewId);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        (<IStatefulTabViewManager>this.tabViewManager).restoreTabViewState();
    }
}
