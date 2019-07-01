import { Component, Injector } from '@angular/core';

import { TabDescriptor, SecondaryTabViewHostViewModel } from 'life-core/component/layout/tabview';
import { ConvertUtil } from 'life-core/util/lang';
import { AuthorizationProvider } from 'life-core/authorization';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';
import { WorksheetAuthorizationProvider } from './wosksheet-authorization.provider';
import { LsTabDescriptorFactory } from 'ui/tabview';

@Component({
    selector: 'worksheet',
    templateUrl: './tabview-worksheet.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: WorksheetAuthorizationProvider }]
})
export class TabViewWorksheetComponent extends SecondaryTabViewHostViewModel {
    protected policy: PolicyDTO;

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
    }

    protected get tabViewId(): string {
        return `worksheet-${this.policy.PolicyId}`;
    }

    protected getStaticTabs(): TabDescriptor[] {
        const policyId = ConvertUtil.toNumber(this.policy.PolicyId);
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabCaseDisp = tabDescriptorFactory.createSecondaryTabDescriptorCaseDesp(policyId);
        const tabReviewMessages = tabDescriptorFactory.createSecondaryTabDescriptorReviewMessages(policyId);
        const tabDebitCredit = tabDescriptorFactory.createSecondaryTabDescriptorDebitCredit(policyId);
        const tabs = [tabCaseDisp, tabReviewMessages, tabDebitCredit];
        tabReviewMessages.selected = true;
        return tabs;
    }

    protected getDataToSave(): PolicyDTO {
        return this.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
