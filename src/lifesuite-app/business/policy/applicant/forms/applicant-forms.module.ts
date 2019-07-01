import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantFormsComponent } from './applicant-forms.component';
import { ApplicantFormsDialogDetailEditor } from './detail/applicant-forms-dialog-detail-editor.component';
import { ApplicantFormsMetaDataResolver } from './applicant-forms-metadata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ApplicantFormsComponent, ApplicantFormsDialogDetailEditor],
    exports: [ApplicantFormsComponent],
    providers: [ApplicantFormsMetaDataResolver],
    entryComponents: [ApplicantFormsDialogDetailEditor]
})
export class ApplicantFormsModule {}
