import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import {
    RxOtherMedicationComponent,
    RxOtherMedicationMetaDataResolver,
    RxOtherMedicationTabComponent,
    OtherMedicationDetailEditorComponent,
    OtherMedicationDetailCreatorComponent,
    OtherMedicationDataListComponent,
    OtherMedicationDetailDataResolver,
    OtherDrugMedicationDataDetailComponent,
    OtherDrugMedicationDataListComponent
} from 'business/policy/evidence';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        RxOtherMedicationTabComponent,
        RxOtherMedicationComponent,
        OtherMedicationDetailCreatorComponent,
        OtherMedicationDataListComponent,
        OtherMedicationDetailEditorComponent,
        OtherDrugMedicationDataListComponent,
        OtherDrugMedicationDataDetailComponent
    ],
    exports: [RxOtherMedicationTabComponent],
    providers: [RxOtherMedicationMetaDataResolver, OtherMedicationDetailDataResolver],
    entryComponents: [
        OtherMedicationDetailCreatorComponent,
        OtherMedicationDetailEditorComponent,
        OtherDrugMedicationDataDetailComponent
    ]
})
export class RxOtherMedicationModule {}
