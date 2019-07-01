import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { OtherInsuranceCasesComponent } from './other-insurance-cases.component';
import { OtherInsuranceCasesDialogDetailEditor } from './detail/other-insurance-cases-detail-editor';
import { OtherInsuranceCasesDialogDataResolver } from './detail/other-insurance-cases-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [OtherInsuranceCasesComponent, OtherInsuranceCasesDialogDetailEditor],
    exports: [OtherInsuranceCasesComponent, OtherInsuranceCasesDialogDetailEditor],
    providers: [OtherInsuranceCasesDialogDataResolver],
    entryComponents: [OtherInsuranceCasesDialogDetailEditor]
})
export class OtherInsuranceCasesModule {}
