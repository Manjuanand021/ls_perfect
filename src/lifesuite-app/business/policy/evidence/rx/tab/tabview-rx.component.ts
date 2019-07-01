import { Component, Injector } from '@angular/core';

import { TabDescriptor, TertiaryTabViewHostViewModel } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from 'ui/tabview';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';
import { ConvertUtil } from 'life-core/util/lang';

@Component({
    selector: 'tabview-rx',
    templateUrl: './tabview-rx.component.html',
    providers: [PolicySubscriber]
})
export class TabViewRxComponent extends TertiaryTabViewHostViewModel {
    protected policy: PolicyDTO;

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
    }

    protected get tabViewId(): string {
        return `rx-${this.policy.PolicyId}`;
    }

    protected getStaticTabs(): TabDescriptor[] {
        const policyId = ConvertUtil.toNumber(this.policy.PolicyId);
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabRxReport = tabDescriptorFactory.createTertiaryTabDescriptorRxReport(policyId);
        const tabRxRules = tabDescriptorFactory.createTertiaryTabDescriptorRxRules(policyId);
        const tabRxOtherMedication = tabDescriptorFactory.createTertiaryTabDescriptorRxOtherMedication(policyId);
        const tabs = [tabRxReport, tabRxRules, tabRxOtherMedication];
        tabRxReport.selected = true;
        return tabs;
    }
}
