import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { ImpairmentComponent } from './impairment.component';
import { ImpairmentDialogDetailEditor } from './detail/impairment-detail-editor';
import { ImpairmentDialogDataResolver } from './detail/impairment-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ImpairmentComponent, ImpairmentDialogDetailEditor],
    exports: [ImpairmentComponent, ImpairmentDialogDetailEditor],
    providers: [ImpairmentDialogDataResolver],
    entryComponents: [ImpairmentDialogDetailEditor]
})
export class ImpairmentModule {}
