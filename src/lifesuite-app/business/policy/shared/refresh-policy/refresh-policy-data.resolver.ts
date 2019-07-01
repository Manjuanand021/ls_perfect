import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

import { BasePolicyDataResolver } from 'business/policy/shared/data-resolver/base-policy-data.resolver';

@Injectable()
export class RefreshPolicyDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected isPolicyLoaded(): boolean {
        return false;
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REFRESH_DATA_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getPayLoad()
        });
    }

    private getPayLoad(): RefreshDTORequest {
        const request = new RefreshDTORequest();
        request.rootDTOObject = this.appSession.policyDTO;
        return request;
    }
}

export class RefreshDTORequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.RefreshDTORequest, LifeSuite.UIServiceDTO';

    public rootDTOObject: any;
}
