import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { BenefitInfoComponent } from './benefit-info.component';
import { BenefitListComponent } from './benefit-list.component';
import { AddBenefitModule } from './add-benefit/add-benefit.module';
import { BenefitPartyModule } from './benefit-party/benefit-party.module';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, AddBenefitModule, BenefitPartyModule],
    declarations: [BenefitInfoComponent, BenefitListComponent],
    exports: [BenefitInfoComponent, BenefitListComponent],
    entryComponents: [BenefitInfoComponent],
    providers: []
})
export class BenefitModule {}
