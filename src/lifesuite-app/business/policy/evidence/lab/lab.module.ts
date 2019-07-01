import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LsPipeModule } from 'ls-core/util/pipe/ls-pipe.module';
import {
    LabTabComponent,
    LabComponent,
    LabDetailComponent,
    LabCommentDetailComponent,
    LabResultDetailComponent,
    LabDataResolver
} from './index';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, LsPipeModule],
    declarations: [
        LabTabComponent,
        LabComponent,
        LabDetailComponent,
        LabCommentDetailComponent,
        LabResultDetailComponent
    ],
    providers: [LabDataResolver],
    entryComponents: [LabDetailComponent]
})
export class LabModule {}
