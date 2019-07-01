import { Injector, Injectable } from '@angular/core';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { BaseModel, BaseDTO, Identifiable } from 'ls-core/model';
import { NTree } from 'ls-core/service/load-bypk';

export type ExpandTreeType = NTree<string>;

@Injectable()
export class AgentService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(): Promise<any> {
        const request = this.getRequest();
        const serviceParams = this.getServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload;
        });
    }

    private getServiceParams(request: AgentRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.AGENT,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: request
        });
    }

    private getRequest(): AgentRequest {
        const request = new AgentRequest();
        return request;
    }
}

export class AgentRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.AgentRequest, LifeSuite.UIServiceDTO';

    public agentNumber: string;
}

export class DTOLoadByAgentResponse {
    public dtoObject: BaseModel;
}
