import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { OtherRisksComponent } from './other-risks.component';
import { OtherRisksDialogDetailEditor } from './detail/other-risks-detail-editor';
import { OtherRisksDialogMetaDataResolver } from './detail/other-risks-dialog-metadata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [OtherRisksComponent, OtherRisksDialogDetailEditor],
    exports: [OtherRisksComponent, OtherRisksDialogDetailEditor],
    providers: [OtherRisksDialogMetaDataResolver],
    entryComponents: [OtherRisksDialogDetailEditor]
})
export class OtherRisksModule {}
