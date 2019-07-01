import { NgModule } from '@angular/core';

import { AppConfig } from 'life-core/config/app.config';
import { ConfigurationService } from './configuration.service';
import { LsAppConfig } from './ls-app.config';

@NgModule({
    imports: [],
    declarations: [],
    providers: [ConfigurationService, LsAppConfig, { provide: AppConfig, useClass: LsAppConfig }]
})
export class LsAppConfigModule {}
