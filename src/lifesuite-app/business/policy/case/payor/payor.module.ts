import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { PayorInfoComponent } from './payor-info.component';
import { PayorListComponent } from 'business/policy/case/payor/payor-list.component';
import {
    PayorPersonComponent,
    PayorCompanyComponent,
    PayorEstateComponent,
    PayorPartnershipComponent,
    PayorTrustComponent
} from './type';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        PayorInfoComponent,
        PayorListComponent,
        PayorPersonComponent,
        PayorCompanyComponent,
        PayorEstateComponent,
        PayorPartnershipComponent,
        PayorTrustComponent
    ],
    exports: [PayorInfoComponent, PayorListComponent],
    entryComponents: [
        PayorInfoComponent,
        PayorPersonComponent,
        PayorCompanyComponent,
        PayorEstateComponent,
        PayorPartnershipComponent,
        PayorTrustComponent
    ]
})
export class PayorModule {}
