import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseDistributionComponent } from './case-distribution.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CaseDistributionComponent],
    exports: [CaseDistributionComponent]
})
export class CaseDistributionModule {}
