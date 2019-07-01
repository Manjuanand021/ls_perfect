import { RequirementMatchUnmatchRequest } from './save-match-requirement-data.delegate';
import { Injectable } from '@angular/core';

import {
    SavePolicyDataDelegate,
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    SaveDTOInfo
} from 'ls-core/service';

@Injectable()
export class SaveUnmatchRequirementDataDelegate extends SavePolicyDataDelegate {
    protected getServiceParams(data: any): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.UNMATCH_REQUIREMENT,
            serviceMethod: UIServiceMethods.SAVE_DATA,
            requestPayload: this.getPayload(data)
        });
    }

    private getPayload(data: any): RequirementMatchUnmatchRequest {
        const request = new RequirementMatchUnmatchRequest();
        request.requirementDTO = data.requirement;
        request.saveDTOInfo = new SaveDTOInfo(data.policy, this.getDeletedObjects());
        return request;
    }
}
