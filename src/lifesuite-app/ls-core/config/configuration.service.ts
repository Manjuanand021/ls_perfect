import { Injectable } from '@angular/core';

import { MetadataLoader, MetadataResult } from 'ls-core/util/metadata/metadata-loader';
import { MetadataItem } from 'ls-core/model';
import { SystemSetting } from './ls-app-setting';

@Injectable()
export class ConfigurationService {
    private _metadataLoader: MetadataLoader;

    constructor(metadataLoader: MetadataLoader) {
        this._metadataLoader = metadataLoader;
    }

    public getSystemSettings(): Promise<MetadataItem[]> {
        const systemSettingTypes = this.getUniqueSystemSettingTypes();
        return this._metadataLoader.load(systemSettingTypes).then(data => {
            return this.mergeSystemSettings(systemSettingTypes, data);
        });
    }

    private getUniqueSystemSettingTypes(): Array<string> {
        const allSettingTypes: Array<string> = Object.keys(SystemSetting).map(key => SystemSetting[key].type);
        return Array.from(new Set<string>(allSettingTypes));
    }

    private mergeSystemSettings(systemSettingTypes: Array<string>, data: MetadataResult): MetadataItem[] {
        let result = [];
        systemSettingTypes.forEach(settingType => {
            result = result.concat(data[settingType]);
        });
        return result;
    }
}
