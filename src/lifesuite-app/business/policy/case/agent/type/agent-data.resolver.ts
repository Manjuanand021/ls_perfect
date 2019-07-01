import { Injector, Injectable } from '@angular/core';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { AgentDTO } from 'ls-core/model';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { IDefaultConstructor } from 'life-core/util/lang';
import { AgentRequest } from 'business/policy/case/agent/agent-service';

@Injectable()
export class AgentDataResolver extends BaseViewDataResolver {
    public activeAgentNumber: string;

    constructor(injector: Injector) {
        super(injector);
    }

    protected get agent(): AgentDTO {
        return this.resolvedData;
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.AGENT,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRequestPayload()
        });
    }

    protected getCreateObjectType<AgentDTO>(): IDefaultConstructor<any> {
        return AgentDTO;
    }

    private getRequestPayload(): AgentRequest {
        const request = new AgentRequest();
        request.agentNumber = this.activeAgentNumber;
        return request;
    }
}
