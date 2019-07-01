import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppInitializeService } from './app-initialize.service';
import { AppInitializeErrorComponent } from './app-initialize-error.component';
import { AppInitializeErrorHandlers } from './app-initialize-error-handlers';
import { SystemStartupSettingsRetrievalDelegate } from './system-startup-settings-retrieval.delegate';

export function appInitializeServiceFactory(appInitializeService: AppInitializeService): Function {
    return (): any => appInitializeService.initialize();
}

@NgModule({
    declarations: [AppInitializeErrorComponent],
    providers: [
        SystemStartupSettingsRetrievalDelegate,
        AppInitializeService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializeServiceFactory,
            deps: [AppInitializeService],
            multi: true
        },
        AppInitializeErrorHandlers
    ]
})
export class AppInitializeModule {}
