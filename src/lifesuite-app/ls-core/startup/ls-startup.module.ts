import { NgModule } from '@angular/core';

import {
    StoredContextResolver,
    SSOADUserContextResolver,
    SSOUserContextResolver,
    StartupPolicyContextResolver
} from './index';
import { LocalStorage } from 'life-core/storage/local-storage';
import { StartupContextUtil } from 'life-core/startup';

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: [
        SSOUserContextResolver,
        StoredContextResolver,
        SSOADUserContextResolver,
        StartupPolicyContextResolver,
        LocalStorage,
        StartupContextUtil
    ]
})
export class LsStartupModule {}
