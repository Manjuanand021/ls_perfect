import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantPersonalInfoComponent } from './applicant-personal-info.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ApplicantPersonalInfoComponent],
    exports: [ApplicantPersonalInfoComponent],
    entryComponents: [ApplicantPersonalInfoComponent]
})
export class ApplicantPersonalInfoModule {}
