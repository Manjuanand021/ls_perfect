import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AddBenefitComponent } from './add-benefit.component';
import { AddBenefitDataResolver } from './add-benefit-data.resolver';
import { AddBenefitListDataResolver } from './add-benefit-listdata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AddBenefitComponent],
    exports: [AddBenefitComponent],
    entryComponents: [AddBenefitComponent],
    providers: [AddBenefitDataResolver, AddBenefitListDataResolver]
})
export class AddBenefitModule {}
