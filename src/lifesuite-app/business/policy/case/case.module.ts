import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { OwnerModule } from './owner/owner.module';
import { CaseInfoComponent } from './case-info.component';
import { CaseDataResolver } from './case-data.resolver';
import { CaseListDataResolver } from './case-list-data.resolver';
import { CasePaymentModule } from './payment/case-payment.module';
import { PayorModule } from './payor/payor.module';
import { CaseDistributionModule } from './distribution/case-distribution.module';
import { CaseInformationModule } from './information/case-information.module';
import { EmployerModule } from './employer/case-employer.module';
import { TPAModule } from './tpa/tpa.module';
import { AgencyModule } from './agency/agency.module';
import { AssociationModule } from './association/case-association.module';
import { AgentModule } from './agent/agent.module';
import { CaseMetaDataResolver } from './case-meta-data.resolver';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LsComponentsModule,
        OwnerModule,
        CasePaymentModule,
        PayorModule,
        CaseDistributionModule,
        CaseInformationModule,
        EmployerModule,
        CaseInformationModule,
        TPAModule,
        AgencyModule,
        AssociationModule,
        AgentModule
    ],
    declarations: [CaseInfoComponent],
    providers: [CaseDataResolver, CaseListDataResolver, CaseMetaDataResolver]
})
export class CaseModule {}
