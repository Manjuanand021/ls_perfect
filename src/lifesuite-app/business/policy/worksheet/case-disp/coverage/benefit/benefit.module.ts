import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { BenefitComponent } from './benefit.component';
import { BenefitDialogDetailEditor } from './detail/benefit-detail-editor';
import { BenefitDialogDataResolver } from './detail/benefit-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [BenefitComponent, BenefitDialogDetailEditor],
    exports: [BenefitComponent, BenefitDialogDetailEditor],
    providers: [BenefitDialogDataResolver],
    entryComponents: [BenefitDialogDetailEditor]
})
export class BenefitModule {}
