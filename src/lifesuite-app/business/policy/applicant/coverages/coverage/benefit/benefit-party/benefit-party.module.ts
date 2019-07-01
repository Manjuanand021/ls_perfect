import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { BenefitPartyComponent } from './benefit-party.component';
import { BenefitPartyDetailEditor } from './detail/benefit-party-detail-editor';
import { BenefitPartyListDataResolver } from './detail/benefit-party-listdata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [BenefitPartyComponent, BenefitPartyDetailEditor],
    exports: [BenefitPartyComponent, BenefitPartyDetailEditor],
    providers: [BenefitPartyListDataResolver],
    entryComponents: [BenefitPartyDetailEditor]
})
export class BenefitPartyModule {}
