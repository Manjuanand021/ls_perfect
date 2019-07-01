import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { ToolBarKey, ToolBarElement } from 'life-core/component/toolbar';

@Injectable()
export class ToolBarService {
    private _dataService: DataService;
    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public loadToolBar(toolBarKey: ToolBarKey): Promise<ToolBarElement[]> {
        const serviceParams: DataServiceParams = this.getServiceParams(toolBarKey);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload ? (response.responsePayload as ToolBarElement[]) : [];
        });
    }

    private getServiceParams(toolBarKey: ToolBarKey): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TOOLBAR,
            serviceMethod: UIServiceMethods.LOAD_DATA,
            requestPayload: this.buildRequestPayload(toolBarKey)
        });
    }

    private buildRequestPayload(toolBarKey: ToolBarKey): ToolBarRequest {
        const request = new ToolBarRequest();
        request.toolBarType = toolBarKey.toolBarName;
        request.objectID = toolBarKey.objectId;
        return request;
    }
}

class ToolBarRequest {
    public readonly $type: string = 'life.common.ToolBarRequest, UICommon';
    public toolBarType: string;
    public objectID: string;
}
