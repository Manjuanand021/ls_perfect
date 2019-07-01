import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import {
    ChangeDispositionListDataResolver,
    ChangeDispositionComponent
} from 'business/policy/worksheet/case-disp/change-disp';
import { CaseDispositionComponent } from 'business/policy/worksheet/case-disp/case-disp.component';
import { CaseDispositionDataResolver } from 'business/policy/worksheet/case-disp/case-disp-data.resolver';
import { CaseDispositionListDataResolver } from 'business/policy/worksheet/case-disp/case-disp-listdata.resolver';
import { CaseDispositionMetaDataResolver } from 'business/policy/worksheet/case-disp/case-disp-metadata.resolver';
import {
    PlanWorksheetCoverageFormFields,
    WorksheetCoverageFormFieldsLoader
} from 'business/policy/worksheet/case-disp/coverage/form';

import { InsuredComponent } from 'business/policy/worksheet/case-disp/insured/insured.component';
import { WorksheetCoverageModule } from 'business/policy/worksheet/case-disp/coverage/worksheet-coverage.module';
import { BenefitComponent } from 'business/policy/worksheet/case-disp/benefit.component';
import { ReopenCoverageModule } from 'business/policy/worksheet/case-disp/coverage/reopen-coverage';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, WorksheetCoverageModule, ReopenCoverageModule],
    declarations: [ChangeDispositionComponent, CaseDispositionComponent, InsuredComponent, BenefitComponent],
    exports: [ChangeDispositionComponent, CaseDispositionComponent, InsuredComponent, BenefitComponent],
    providers: [
        CaseDispositionDataResolver,
        CaseDispositionListDataResolver,
        CaseDispositionMetaDataResolver,
        PlanWorksheetCoverageFormFields,
        WorksheetCoverageFormFieldsLoader,
        ChangeDispositionListDataResolver
    ],
    entryComponents: [ChangeDispositionComponent]
})
export class CaseDispositionModule {}
