import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { TabPolicyDataResolver, RelatedPolicyHelper } from 'business/policy/shared';

import { PolicyQuickInfoPanelComponent } from './policy-quick-info-panel.component';
import { PolicyQuickInfoFormDataBuilder, PolicyQuickInfoFieldsLoader, PolicyQuickInfoFormFields } from './form';
import { ApplicantStatusResolver } from './form/resolvers/applicant-status.resolver';
import {
    LineofBusinessDescriptionResolver,
    ApplicationTypeDescriptionResolver,
    PolicyAssociationDescriptionResolver,
    TPANameResolver,
    ServiceAssociateResolver,
    UnderwriterResolver,
    ApplicantsCountResolver,
    ReceivedRequirementsListResolver,
    OutstandingRequirementsListResolver,
    RelatedPoliciesCountResolver,
    AgentPhoneResolver,
    AgentNameResolver,
    AgentEmailResolver
} from './form/resolvers';
import { PolicyQuickInfoPanelMetaDataResolver } from './policy-quick-info-panel-metadata.resolver';

export const MENU_EXPORTS: Array<any> = [PolicyQuickInfoPanelComponent];

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [PolicyQuickInfoPanelComponent],
    providers: [
        TabPolicyDataResolver,
        PolicyQuickInfoPanelMetaDataResolver,
        PolicyQuickInfoFormDataBuilder,
        PolicyQuickInfoFieldsLoader,
        PolicyQuickInfoFormFields,
        ApplicantStatusResolver,
        LineofBusinessDescriptionResolver,
        ApplicationTypeDescriptionResolver,
        PolicyAssociationDescriptionResolver,
        TPANameResolver,
        ServiceAssociateResolver,
        UnderwriterResolver,
        ApplicantsCountResolver,
        ReceivedRequirementsListResolver,
        OutstandingRequirementsListResolver,
        RelatedPolicyHelper,
        RelatedPoliciesCountResolver,
        AgentPhoneResolver,
        AgentNameResolver,
        AgentEmailResolver
    ],
    exports: [...MENU_EXPORTS]
})
export class PolicyQuickInfoPanelModule {}
