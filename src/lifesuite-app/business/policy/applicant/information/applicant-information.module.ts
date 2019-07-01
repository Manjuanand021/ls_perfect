import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { ApplicantInformationComponent } from './applicant-information.component';
import { ApplicantActionComponent } from 'business/policy/applicant/information/applicant-action/applicant-action.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ApplicantInformationComponent, ApplicantActionComponent],
    exports: [ApplicantInformationComponent, ApplicantActionComponent],
    entryComponents: []
})
export class ApplicantInformationModule {}
