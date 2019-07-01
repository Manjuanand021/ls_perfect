import { Injectable } from '@angular/core';

import { SavePolicyDataDelegate, DataServiceParams, UIServiceNames, UIServiceMethods, SaveDTOInfo } from 'ls-core/service';
import { RequirementDTO } from 'ls-core/model';

@Injectable()
export class SaveMatchRequirementDataDelegate extends SavePolicyDataDelegate {

    private _requirementDTO: RequirementDTO;
    
    protected getServiceParams(data: any): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.MATCH_REQUIREMENT,
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

export class RequirementMatchUnmatchRequest {
    readonly $type: string = 'life.ls.ui.ria.dto.requests.RequirementMatchUnmatchRequest, LifeSuite.UIServiceDTO';

    public saveDTOInfo: SaveDTOInfo;
    public requirementDTO: RequirementDTO;
}