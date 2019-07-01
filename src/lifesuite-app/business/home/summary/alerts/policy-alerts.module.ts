import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { PolicyAlertsComponent } from './policy-alerts.component';
import { TaskFilterService } from 'business/home/tasks/filter/task-filter.service';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [PolicyAlertsComponent],
    exports: [PolicyAlertsComponent],
    providers: [TaskFilterService]
})
export class PolicyAlertsModule {}
