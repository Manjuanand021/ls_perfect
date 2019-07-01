import { Injectable } from '@angular/core';

import { DataService } from '../data.service';
import { DataServiceParams } from '../data-service.model';
import { UIServiceNames, UIServiceMethods } from '../service-method-ids';
import { BaseModel, Identifiable } from 'ls-core/model';
import { NTree } from 'ls-core/service/load-bypk';

export type ExpandTreeType = NTree<string>;

/**
 * Load by Primary Key(PK) service to load collections of objects by object tree.
 */
@Injectable()
export class LoadByPKService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(
        workingIdentifier: Identifiable,
        expandTree: ExpandTreeType,
        loadAllTree: boolean = false
    ): Promise<any> {
        const request = this.getRequest(workingIdentifier, expandTree);
        const serviceParams = this.getServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload;
        });
    }

    private getServiceParams(request: DTOLoadByPKWithExpandRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.DTO_LOAD,
            serviceMethod: UIServiceMethods.DTO_LOAD,
            requestPayload: request
        });
    }

    private getRequest(
        workingIdentifier: Identifiable,
        expandTree: ExpandTreeType,
        LoadAllTree: boolean = false
    ): DTOLoadByPKWithExpandRequest {
        const request = new DTOLoadByPKWithExpandRequest();
        request.WorkingIdentifiable = workingIdentifier;
        request.ExpandTree = expandTree;
        request.LoadAllTree = LoadAllTree;
        return request;
    }
}

export class DTOLoadByPKWithExpandRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.DTOLoadByPKWithExpandRequest, LifeSuite.UIServiceDTO';

    public ParentIdentifiable: Identifiable;

    public WorkingIdentifiable: Identifiable;

    public ExpandTree: NTree<string>;

    public LoadAllTree: boolean;

    public FirstTime: boolean;
}

export class DTOLoadByPKRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.DTOLoadByPKRequest, LifeSuite.UIServiceDTO';
    public _parentDTOObject: BaseModel;
    public _workingDTOObject: BaseModel;
    public _eagerLoad: boolean = false;
}

export class DTOLoadByPKResponse {
    public dtoObject: BaseModel;
}
