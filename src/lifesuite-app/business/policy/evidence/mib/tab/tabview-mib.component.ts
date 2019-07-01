import { Component, Injector } from '@angular/core';

import { TabDescriptor, TertiaryTabViewHostViewModel } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from 'ui/tabview';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';
import { ConvertUtil } from 'life-core/util/lang';

@Component({
    selector: 'tabview-mib',
    templateUrl: './tabview-mib.component.html',
    providers: [PolicySubscriber]
})
export class TabViewMIBComponent extends TertiaryTabViewHostViewModel {
    protected policy: PolicyDTO;

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
    }

    protected get tabViewId(): string {
        return `mib-${this.policy.PolicyId}`;
    }

    protected getStaticTabs(): TabDescriptor[] {
        const policyId = ConvertUtil.toNumber(this.policy.PolicyId);
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabMIBReport = tabDescriptorFactory.createTertiaryTabDescriptorMIBReport(policyId);
        const tabMIBCoding = tabDescriptorFactory.createTertiaryTabDescriptorMIBCoding(policyId);
        const tabs = [tabMIBReport, tabMIBCoding];

        tabMIBReport.selected = true;
        return tabs;
    }
}
