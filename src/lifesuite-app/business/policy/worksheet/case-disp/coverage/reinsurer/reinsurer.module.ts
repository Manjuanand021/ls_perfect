import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { ReinsurerComponent } from './reinsurer.component';
import { ReinsurerDialogDetailEditor } from './detail/reinsurer-detail-editor';
import { ReinsurerDialogDataResolver } from './detail/reinsurer-dialog-data.resolver';
import { ReinsurerDialogMetaDataResolver } from './detail/reinsurer-dialog-metadata.resolver';
import { LsPipeModule } from 'ls-core/util/pipe/ls-pipe.module';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, LsPipeModule],
    declarations: [ReinsurerComponent, ReinsurerDialogDetailEditor],
    exports: [ReinsurerComponent, ReinsurerDialogDetailEditor],
    providers: [ReinsurerDialogDataResolver, ReinsurerDialogMetaDataResolver],
    entryComponents: [ReinsurerDialogDetailEditor]
})
export class ReinsurerModule {}
