import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantCoverageComponent } from './applicant-coverage.component';
import { BenefitModule } from './benefit/benefit.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { FundsListModule } from './funds/funds-list.module';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, BenefitModule, BeneficiaryModule, FundsListModule],
    declarations: [ApplicantCoverageComponent],
    exports: [ApplicantCoverageComponent]
})
export class ApplicantCoverageModule {}
