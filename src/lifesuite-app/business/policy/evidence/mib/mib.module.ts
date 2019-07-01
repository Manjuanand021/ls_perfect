import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LsPipeModule } from 'ls-core/util/pipe/ls-pipe.module';
import { TabViewMIBComponent } from './tab';
import { MIBTabComponent } from './mib.component';
import {
    MIBCodingTabComponent,
    MIBCodingComponent,
    MIBCodingDetailDialogEditor,
    MIBSubmittedCodesComponent,
    MIBCodingDataResolver,
    MIBCodingMetaDataResolver
} from './mib-coding';
import {
    MIBReportComponent,
    MIBReportDetailComponent,
    MIBReportItemDetailComponent,
    MIBReportDataResolver
} from './mib-report';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, LsPipeModule],
    declarations: [
        MIBTabComponent,
        TabViewMIBComponent,
        MIBReportComponent,
        MIBReportDetailComponent,
        MIBReportItemDetailComponent,
        MIBCodingTabComponent,
        MIBSubmittedCodesComponent,
        MIBCodingComponent,
        MIBCodingDetailDialogEditor
    ],
    providers: [MIBReportDataResolver, MIBCodingDataResolver, MIBCodingMetaDataResolver],
    entryComponents: [MIBReportItemDetailComponent, MIBCodingDetailDialogEditor]
})
export class MIBModule {}
