import { Injector, Injectable } from '@angular/core';

import { ConvertUtil } from 'life-core/util/lang';

import { PolicyDTO, PolicyProxy } from 'ls-core/model';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

@Injectable()
export class RelatedPolicyHelper {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public getRelatedPolicies(policy: PolicyDTO): Promise<[PolicyProxy]> {
        const serviceParams: DataServiceParams = this.getRelatedPolciesServiceParams(policy);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as [PolicyProxy];
        });
    }

    private getRelatedPolciesServiceParams(policy: PolicyDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.RELATED_POLICIES_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRelatedPolciesServicePayload(policy)
        });
    }

    private getRelatedPolciesServicePayload(policy: PolicyDTO): RelatedPoliciesRequest {
        const request = new RelatedPoliciesRequest();
        request.policyId = ConvertUtil.toNumber(policy.PolicyId);
        request.caseGroupId = policy.CaseGroupId;
        return request;
    }
}

export class RelatedPoliciesRequest {
    readonly $type: string = 'life.ls.ui.ria.dto.requests.RelatedPoliciesRequest, LifeSuite.UIServiceDTO';

    public policyId: number;
    public caseGroupId: string;
}
