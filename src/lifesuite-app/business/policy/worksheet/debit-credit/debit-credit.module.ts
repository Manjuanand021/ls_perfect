import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { DebitCreditComponent, DebitCreditDataResolver, DebitCreditMetaDataResolver } from './';
import { DebitCreditHelper } from 'business/policy/shared';
import { OtherRisksModule } from './other-risks/other-risks.module';
import { SystemGeneratedModule } from './system-generated/system-generated.module';
import { UserGeneratedModule } from './user-generated/user-generated.module';
import { CoronaryTestsComponent } from './coronary-tests/coronary-tests.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComponentsModule,
        OtherRisksModule,
        SystemGeneratedModule,
        UserGeneratedModule
    ],
    declarations: [DebitCreditComponent, CoronaryTestsComponent],
    exports: [DebitCreditComponent],
    providers: [DebitCreditDataResolver, DebitCreditMetaDataResolver, DebitCreditHelper]
})
export class DebitCreditModule {}
