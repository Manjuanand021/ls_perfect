import { Injectable } from '@angular/core';

import { LsAppConfig, SystemSetting } from 'ls-core/config';

@Injectable()
export class CanCapturePerformanceMetricsDelegate {
    private _appSetting: LsAppConfig;

    constructor(appConfig: LsAppConfig) {
        this._appSetting = appConfig;
    }

    public isAllowed(): string {
        return this._appSetting.getSystemSetting(SystemSetting.CapturePerformanceMetrics);
    }
}
