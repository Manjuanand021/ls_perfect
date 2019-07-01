import { TabViewHostViewModel } from './tabview-host.vm';
import { ITabViewManager } from '../manager/tabview.manager';
import { IStatefulTabViewManager } from '../manager/stateful-tabview.manager';
import { TertiaryTabViewManager } from '../manager/tertiary-tabview.manager';

/**
 * Base ViewModel class for components hosting Tertiary (third nested level) TabView
 */
export abstract class TertiaryTabViewHostViewModel extends TabViewHostViewModel {
    protected createTabViewManager(): ITabViewManager {
        return new TertiaryTabViewManager(this.injector, this.tabViewId);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        (<IStatefulTabViewManager>this.tabViewManager).restoreTabViewState();
    }
}
