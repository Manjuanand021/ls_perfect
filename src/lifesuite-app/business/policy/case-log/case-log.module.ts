import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseLogComponent } from './case-log.component';
import { CaseLogListComponent } from './list/case-log-list.component';
import { CaseLogFilterComponent } from './filter/case-log-filter.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CaseLogComponent, CaseLogListComponent, CaseLogFilterComponent],
    providers: [],
    entryComponents: [CaseLogComponent]
})
export class CaseLogModule {}
