import { Component, Injector } from '@angular/core';

import { TabDescriptor, SecondaryTabViewHostViewModel } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from 'ui/tabview';

@Component({
    selector: 'tabview-home',
    templateUrl: './tabview-home.component.html'
})
export class TabViewHomeComponent extends SecondaryTabViewHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get tabViewId(): string {
        return 'tabViewHome';
    }

    protected getStaticTabs(): TabDescriptor[] {
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabWorkItems = tabDescriptorFactory.createSecondaryTabDescriptorWorkItems();
        const tabTasks = tabDescriptorFactory.createSecondaryTabDescriptorTasks();
        const tabSummary = tabDescriptorFactory.createSecondaryTabDescriptorSummary();
        tabWorkItems.selected = true;
        return [tabSummary, tabWorkItems, tabTasks];
    }
}
