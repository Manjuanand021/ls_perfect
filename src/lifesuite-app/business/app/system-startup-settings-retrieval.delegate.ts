import { Injectable } from '@angular/core';

import { LsAppConfig } from 'ls-core/config';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { MetadataItem } from 'ls-core/model';

@Injectable()
export class SystemStartupSettingsRetrievalDelegate {
    private _dataService: DataService;
    private _appConfig: LsAppConfig;

    constructor(appConfig: LsAppConfig, dataService: DataService) {
        this._dataService = dataService;
        this._appConfig = appConfig;
    }

    public getStartupSettings(): Promise<void> {
        const serviceParams = this.getStartupSettingsServiceParams();
        return this._dataService.getData(serviceParams).then(response => {
            const startupSettings = this.createMetadataList(response.responsePayload);
            this._appConfig.startupSettings = startupSettings;
            return Promise.resolve(null);
        });
    }

    protected getStartupSettingsServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.STARTUP_SETTINGS_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA
        });
    }

    private createMetadataList(metadata: any): Array<MetadataItem> {
        if (!metadata) return [];
        return metadata.map(item => {
            return new MetadataItem(item.CodeValue, item.CodeId, item.ExternalCode);
        });
    }
}
