import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { RequirementDTO } from 'ls-core/model';

@Injectable()
export class RequirementItemFactory extends BaseDTOItemFactory<RequirementDTO> {
    public newInstance(createItemParams: RequirementCreateItemParams<RequirementDTO>): RequirementDTO {
        const requirementDTO = createItemParams.requirementDTO;
        requirementDTO.InsuredRequirementId = this.getNextId(createItemParams.items, 'InsuredRequirementId');
        return requirementDTO;
    }
}

export interface RequirementCreateItemParams<T> extends CreateItemParams<T> {
    requirementDTO: RequirementDTO;
}
