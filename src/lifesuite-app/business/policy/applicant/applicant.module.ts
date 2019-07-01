import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantInfoComponent } from './applicant-info.component';
import { ApplicantDetailComponent } from './applicant-detail/applicant-detail.component';
import { ApplicantPersonalInfoModule } from './personal-information/applicant-personal-info.module';
import { ApplicantInfoDataResolver } from './applicant-info-data.resolver';
import { ApplicantInfoListDataResolver } from './applicant-info-list-data.resolver';
import { ApplicantCoveragesModule } from './coverages/applicant-coverages.module';
import { ApplicantFinancialDataModule } from './financial-data/applicant-financial-data.module';
import { ApplicantInformationModule } from './information/applicant-information.module';
import { PhysicianInformationModule } from './physician-information/physician-information.module';
import { FamilyHistoryModule } from './family-history/family-history.module';
import { OtherInsuranceCasesModule } from './other-insurance-cases/other-insurance-cases.module';
import { AddApplicantModule } from './add-applicant';
import { ApplicantFormsModule } from './forms/applicant-forms.module';
import { ApplicantMetaDataResolver } from './applicant-meta-data.resolver';
import { ApplicationReceivedDateValidator } from '../shared/validator/application-received-date-validator';
import { AgentSignedDateValidator } from '../shared/validator/agent-signed-date-validator';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LsComponentsModule,
        ApplicantCoveragesModule,
        ApplicantPersonalInfoModule,
        ApplicantFinancialDataModule,
        ApplicantInformationModule,
        PhysicianInformationModule,
        FamilyHistoryModule,
        OtherInsuranceCasesModule,
        AddApplicantModule,
        ApplicantFormsModule
    ],
    declarations: [ApplicantInfoComponent, ApplicantDetailComponent],
    providers: [
        ApplicantInfoDataResolver,
        ApplicantInfoListDataResolver,
        ApplicantMetaDataResolver,
        AgentSignedDateValidator,
        ApplicationReceivedDateValidator
    ]
})
export class ApplicantModule {}
