import { Injectable } from '@angular/core';

import { DataService } from '../data.service';
import { DataServiceParams } from '../data-service.model';
import { UIServiceNames, UIServiceMethods } from '../service-method-ids';

/**
 *  DefaultDataService provides functionality to load default data for given DTO
 */
@Injectable()
export class DefaultDataService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public setDefaultData(payload: SetDefaultDataRequest): Promise<SetDefaultDataResponse> {
        const serviceParams = this.getServiceParams(payload);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as SetDefaultDataResponse;
        });
    }

    private getServiceParams(payload: SetDefaultDataRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.DEFAULT_DATA,
            serviceMethod: UIServiceMethods.SET_DATA,
            requestPayload: payload
        });
    }
}

export class SetDefaultDataRequest {
    public readonly $type: string = 'life.common.SetDefaultDataRequest, UICommon';
    public rootDTO: object;
    public workingDTO: object;
    public workingDTOId: string;

    constructor(rootDTO: object, workingDTO: object, workingDTOId: string) {
        this.rootDTO = rootDTO;
        this.workingDTO = workingDTO;
        this.workingDTOId = workingDTOId;
    }
}

export class SetDefaultDataResponse {
    public readonly $type: string = 'life.common.SetDefaultDataResponse, UICommon';
    public rootDTO: object;
    public workingDTO: object;
    public workingDTOId: string;

    constructor(rootDTO: object, workingDTO: object, workingDTOId: string) {
        this.rootDTO = rootDTO;
        this.workingDTO = workingDTO;
        this.workingDTOId = workingDTOId;
    }
}
