import { Injectable } from '@angular/core';

import { IGetDataDelegate, IUpdateDataDelegate } from 'life-core/service';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { UserDTO } from 'ls-core/model/dto';

@Injectable()
export class UserDataDelegate implements IGetDataDelegate<string>, IUpdateDataDelegate<UserDTO> {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public getData(request: string): Promise<UserDTO> {
        const serviceParams: DataServiceParams = this.getGetServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as UserDTO;
        });
    }

    public updateData(request: UserDTO): Promise<void> {
        const serviceParams: DataServiceParams = this.getUpdateServiceParams(request);
        return this._dataService.updateData(serviceParams).then(response => {});
    }

    protected getGetServiceParams(request: string): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.USER_PREFERENCES,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: request
        });
    }

    protected getUpdateServiceParams(request: UserDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.USER_PREFERENCES,
            serviceMethod: UIServiceMethods.SAVE_DATA,
            requestPayload: request
        });
    }
}
