import { Injectable } from '@angular/core';

import { AppConfig } from 'life-core/config/app.config';
import { Logger, ILogger } from 'life-core/logging';
import { MetadataItem } from 'ls-core/model';
import { MetadataUtil } from 'ls-core/util/metadata/metadata.util';
import { SystemSettingEntryType } from './ls-app-setting';

@Injectable()
export class LsAppConfig extends AppConfig {
    public systemSettings: Array<MetadataItem> = [];

    public startupSettings: Array<MetadataItem> = [];

    /**
     *  Disable concurrent service requests
     *  until back end is able to handle it.
     */
    public readonly allowConcurrentServiceRequests: boolean = false;

    public static readonly maxNumberOfOpenPolicyTabs: number = 6;

    public readonly helpPdfUrl: string = '../../../{locale}/assets/LifeSuiteQuickStart.pdf';

    /**
     * Controls showing error dialog when there is client/javascript error
     */
    public readonly showClientErrorDialog: boolean = false;

    public readonly fixedTopBarHeight: number = 55;

    private _logger: ILogger;

    constructor(logger: Logger) {
        super();
        this._logger = logger;
    }

    public getSystemSetting(settingEntry: SystemSettingEntryType): string {
        if (settingEntry.type == null) {
            this._logger.warn(`Setting type for ${settingEntry.name} is not defined!`);
        }
        return MetadataUtil.getItemLabelByCode(this.systemSettings, settingEntry.name);
    }

    public getStartupSetting(settingName: string): string {
        return MetadataUtil.getItemLabelByCode(this.startupSettings, settingName);
    }
}
