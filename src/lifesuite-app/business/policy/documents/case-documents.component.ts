import { Component, Injector } from '@angular/core';

import { ConvertUtil } from 'life-core/util/lang';
import { SecondaryTabViewHostViewModel, TabDescriptor } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { SubsystemType, PrivilegeObjectType, PrivilegeType } from 'ls-core/authorization';

import { LsTabDescriptorFactory } from 'ui/tabview';

import { DocumentsAuthorizationProvider } from './documents-authorization.provider';

@Component({
    selector: 'case-documents',
    templateUrl: './case-documents.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: DocumentsAuthorizationProvider }]
})
export class CaseDocumentsComponent extends SecondaryTabViewHostViewModel {
    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    protected get tabViewId(): string {
        return `Documents-${this.data.policy.PolicyId}`;
    }

    protected getStaticTabs(): TabDescriptor[] {
        const policyId = ConvertUtil.toNumber(this.data.policy.PolicyId);
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabDocumentsAttachment = tabDescriptorFactory.createSecondaryTabDocumentsAttachment(policyId);
        const tabDocumentsTemplate = tabDescriptorFactory.createSecondaryTabDocumentsTemplate(policyId);
        const tabs = [tabDocumentsAttachment, tabDocumentsTemplate];
        this.setupTabViewAuthorization(tabs);
        tabDocumentsAttachment.selected = true;
        return tabs;
    }

    protected setupTabViewAuthorization(tabs: Array<TabDescriptor>): void {
        const tabAuthorizationLevel = this.authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.data.policy,
            [PrivilegeType.CASE]
        );
        tabs.forEach(tab => (tab.authorizationLevel = tabAuthorizationLevel));
    }

    protected getDataToSave(): any {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
