import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { SummaryTabComponent } from './summary.component';
import { SummaryFilterComponent } from './filter/summary-filter.component';
import { RecentlyAccessedCasesModule } from './recently-accessed-cases/recently-accessed-cases.module';
import { PolicyAlertsModule } from './alerts/policy-alerts.module';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, RecentlyAccessedCasesModule, PolicyAlertsModule],
    declarations: [SummaryTabComponent, SummaryFilterComponent],
    exports: [SummaryTabComponent]
})
export class SummaryModule {}
