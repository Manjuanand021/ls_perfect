import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { LabDTO } from 'ls-core/model';

@Injectable()
export class LabItemFactory extends BaseDTOItemFactory<LabDTO> {
    public newInstance(createItemParams: CreateItemParams<LabDTO>): LabDTO {
        const labDTO = new LabDTO();
        labDTO.RequirementInformationId = this.getNextId(createItemParams.items, 'RequirementInformationId');
        return labDTO;
    }
}
