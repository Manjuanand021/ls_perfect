import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { BeneficiaryComponent } from './beneficiary.component';
import { BeneficiaryDialogDetailEditor } from './detail/beneficiary-detail-editor';
import { BeneficiaryPersonComponent, BeneficiaryEstateComponent } from './detail/type';
import { BeneficiaryDialogMetaDataResolver, BeneficiaryDialogDataResolver } from './detail';
import { BeneficiaryCompanyComponent } from './detail/type/company/beneficiary-company.component';
import { BeneficiaryPartnershipComponent } from './detail/type/partnership/beneficiary-partnership.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        BeneficiaryComponent,
        BeneficiaryDialogDetailEditor,
        BeneficiaryPersonComponent,
        BeneficiaryEstateComponent,
        BeneficiaryCompanyComponent,
        BeneficiaryPartnershipComponent
    ],
    exports: [BeneficiaryComponent],
    providers: [BeneficiaryDialogDataResolver, BeneficiaryDialogMetaDataResolver],
    entryComponents: [
        BeneficiaryDialogDetailEditor,
        BeneficiaryPersonComponent,
        BeneficiaryEstateComponent,
        BeneficiaryCompanyComponent,
        BeneficiaryPartnershipComponent
    ]
})
export class BeneficiaryModule {}
