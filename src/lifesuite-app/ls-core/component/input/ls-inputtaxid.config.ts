import { Injectable } from '@angular/core';

import { InputTaxIdConfig } from 'life-core/component/input';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

@Injectable()
export class LsInputTaxIdConfig extends InputTaxIdConfig {
    constructor(appConfig: LsAppConfig) {
        super();
        const maskSetting = appConfig.getSystemSetting(SystemSetting.TaxIDMasking);
        this.alwaysMasked = maskSetting && maskSetting.toUpperCase() == 'TRUE';
    }
}
