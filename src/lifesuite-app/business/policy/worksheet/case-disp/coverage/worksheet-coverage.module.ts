import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ImpairmentModule } from './impairment/impairment.module';
import { ReinsurerModule } from './reinsurer/reinsurer.module';
import { WorksheetCoverageComponent } from './worksheet-coverage.component';
import { AmendmentModule } from './amendment/amendment.module';
import { BenefitModule } from 'business/policy/worksheet/case-disp/coverage/benefit/benefit.module';
import { ChangeCoverageDispositionComponent, ChangeCoverageDispositionListDataResolver } from './change-coverage-disp';
import { CoverageValidationComponent } from './change-coverage-disp/coverage-validation/coverage-validation.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LsComponentsModule,
        ImpairmentModule,
        AmendmentModule,
        ReinsurerModule,
        BenefitModule
    ],
    declarations: [WorksheetCoverageComponent, ChangeCoverageDispositionComponent, CoverageValidationComponent],
    exports: [WorksheetCoverageComponent, ChangeCoverageDispositionComponent, CoverageValidationComponent],
    providers: [ChangeCoverageDispositionListDataResolver],
    entryComponents: [ChangeCoverageDispositionComponent, CoverageValidationComponent]
})
export class WorksheetCoverageModule {}
