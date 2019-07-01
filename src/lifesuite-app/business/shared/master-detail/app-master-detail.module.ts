import { NgModule } from '@angular/core';

import { AppMasterButtonLabels } from './app-master-button-labels';
import { MasterButtonLabels } from 'life-core/component/master-detail';

@NgModule({
    providers: [AppMasterButtonLabels, { provide: MasterButtonLabels, useClass: AppMasterButtonLabels }]
})
export class AppMasterDetailModule {}
