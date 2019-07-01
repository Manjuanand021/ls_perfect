import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantCoveragesComponent } from './applicant-coverages.component';
import { PlanApplicantCoverageFormFields, ApplicantCoveragesFieldsLoader } from './form';
import { ApplicantCoverageModule } from './coverage';
import { AddCoverageModule } from './add-coverage';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, ApplicantCoverageModule, AddCoverageModule],
    declarations: [ApplicantCoveragesComponent],
    exports: [ApplicantCoveragesComponent],
    entryComponents: [ApplicantCoveragesComponent],
    providers: [PlanApplicantCoverageFormFields, ApplicantCoveragesFieldsLoader]
})
export class ApplicantCoveragesModule {}
