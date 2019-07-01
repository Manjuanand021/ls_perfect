import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { OwnerInfoComponent } from './owner-info.component';
import { OwnerListComponent } from './owner-list.component';
import {
    OwnerPersonComponent,
    OwnerCompanyComponent,
    OwnerEstateComponent,
    OwnerPartnershipComponent,
    OwnerTrustComponent
} from './type';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        OwnerListComponent,
        OwnerInfoComponent,
        OwnerPersonComponent,
        OwnerCompanyComponent,
        OwnerEstateComponent,
        OwnerPartnershipComponent,
        OwnerTrustComponent
    ],
    exports: [OwnerListComponent, OwnerInfoComponent],
    entryComponents: [
        OwnerInfoComponent,
        OwnerPersonComponent,
        OwnerCompanyComponent,
        OwnerEstateComponent,
        OwnerPartnershipComponent,
        OwnerTrustComponent
    ]
})
export class OwnerModule {}
