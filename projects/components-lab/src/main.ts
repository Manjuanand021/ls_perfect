import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import './polyfills.ts';
import { EnvironmentTypes } from 'environments/environment-types';
import { environment } from './environments';
import { TestModule } from './app/test.module';

if (environment.type == EnvironmentTypes.PROD) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TestModule);
