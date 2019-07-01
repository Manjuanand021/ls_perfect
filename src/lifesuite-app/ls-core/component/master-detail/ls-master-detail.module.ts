import { NgModule } from '@angular/core';
import { MasterDetailNotification } from 'life-core/component/master-detail';
import { LsMasterDetailNotification } from './notification/ls-master-detail-notification';

@NgModule({
    imports: [],
    providers: [{ provide: MasterDetailNotification, useClass: LsMasterDetailNotification }]
})
export class LsMasterDetailModule {}
