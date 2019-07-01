import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AddApplicantComponent } from './add-applicant.component';
import { AddApplicantDataResolver } from './add-applicant-data.resolver';
import { AddApplicantListDataResolver } from './add-applicant-listdata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AddApplicantComponent],
    exports: [AddApplicantComponent],
    entryComponents: [AddApplicantComponent],
    providers: [AddApplicantListDataResolver, AddApplicantDataResolver]
})
export class AddApplicantModule {}
