import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ApplicantFinancialDataComponent } from './applicant-financial-data.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ApplicantFinancialDataComponent],
    exports: [ApplicantFinancialDataComponent],
    entryComponents: [ApplicantFinancialDataComponent]
})
export class ApplicantFinancialDataModule {}
