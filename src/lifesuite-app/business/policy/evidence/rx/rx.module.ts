import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { TabViewRxComponent } from './tab/tabview-rx.component';
import { RxTabComponent } from './rx.component';
import { RxReportComponent, RxReportDataResolver, RxReportLazyDataResolver, RxReportUtil } from './rx-report';
import { RxRulesComponent, RxRulesSummaryComponent, RxUsageComponent } from './rx-rules';
import { PrescriptionInformationComponent } from 'business/policy/evidence/rx/rx-report/prescription-information';
import { PhysicianComponent } from 'business/policy/evidence/rx/rx-report/physician';
import { RxDetailComponent } from 'business/policy/evidence/rx/rx-report/rx-detail';
import { RxReportMetaDataResolver } from './rx-report/rx-report-metadata.resolver';
import { RxOtherMedicationModule } from 'business/policy/evidence/rx/rx-other-medication/rx-other-medication.module';
import { RxWebButtonsComponent } from 'business/policy/evidence/rx';
@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, RxOtherMedicationModule],
    declarations: [
        RxTabComponent,
        TabViewRxComponent,
        RxRulesComponent,
        RxReportComponent,
        PrescriptionInformationComponent,
        PhysicianComponent,
        RxDetailComponent,
        RxRulesSummaryComponent,
        RxUsageComponent,
        RxWebButtonsComponent
    ],
    providers: [RxReportDataResolver, RxReportLazyDataResolver, RxReportMetaDataResolver, RxReportUtil]
})
export class RxModule {}
