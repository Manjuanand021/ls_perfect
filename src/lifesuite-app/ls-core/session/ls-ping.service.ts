import { Injectable } from '@angular/core';

import { PingService } from 'life-core/session';
import { DataService } from 'ls-core/service/data.service';
import { DataServiceParams } from 'ls-core/service/data-service.model';
import { UIServiceNames, UIServiceMethods } from 'ls-core/service/service-method-ids';

@Injectable()
export class LsPingService extends PingService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        super();
        this._dataService = dataService;
    }

    public ping(): void {
        const serviceParams = this.getServiceParams();
        this._dataService.getData(serviceParams);
    }

    private getServiceParams(): DataServiceParams {
        const payload = new PingRequest('');
        return new DataServiceParams({
            serviceInterface: UIServiceNames.PING_SERVICE,
            serviceMethod: UIServiceMethods.PING,
            requestPayload: payload,
            nonBlocking: true
        });
    }
}

export class PingRequest {
    public readonly $type: string = 'life.common.PingRequest, UICommon';

    public pingText: string;

    constructor(pingText: string) {
        this.pingText = pingText;
    }
}

export class PingResponse {
    public readonly $type: string = 'life.common.PingResponse, UICommon';

    public originalPingText: string;

    public currentTime: Date;

    public lastRequestTime: Date;

    public sessionExpired: boolean;

    constructor() {}
}
