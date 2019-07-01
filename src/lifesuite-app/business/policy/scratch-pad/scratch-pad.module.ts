import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';

import { ScratchPadComponent } from './scratch-pad.component';
import { ScratchPadDialogComponent } from './scratch-pad-dialog.component';
import { ScratchPadDataResolver } from './scratch-pad-data.resolver';
import { ScratchPadDataService } from './scratch-pad-data.service';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [ScratchPadComponent, ScratchPadDialogComponent],
    entryComponents: [ScratchPadComponent, ScratchPadDialogComponent],
    providers: [ScratchPadDataResolver, ScratchPadDataService]
})
export class ScratchPadModule {}
