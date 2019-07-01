import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment, EnvironmentTypes } from './environments';
import { AppModule } from './lifesuite-app/app.module';

if (environment.type == EnvironmentTypes.PROD) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
