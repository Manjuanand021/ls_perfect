import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { AmendmentComponent } from './amendment.component';
import { AmendmentDialogDetailEditor } from './detail/amendment-detail-editor';
import { AmendmentDialogDataResolver } from './detail/amendment-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AmendmentComponent, AmendmentDialogDetailEditor],
    exports: [AmendmentComponent, AmendmentDialogDetailEditor],
    providers: [AmendmentDialogDataResolver],
    entryComponents: [AmendmentDialogDetailEditor]
})
export class AmendmentModule {}
