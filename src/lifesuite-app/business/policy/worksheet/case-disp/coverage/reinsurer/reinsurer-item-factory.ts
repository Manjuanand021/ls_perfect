import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { ReinsurerDTO } from 'ls-core/model';

@Injectable()
export class ReinsurerItemFactory extends BaseDTOItemFactory<ReinsurerDTO> {
    public newInstance(createItemParams: CreateItemParams<ReinsurerDTO>): ReinsurerDTO {
        const reinsurerDTO = new ReinsurerDTO();
        reinsurerDTO.CoveragePersonReinsurerId = this.getNextId(createItemParams.items, 'CoveragePersonReinsurerId');
        return reinsurerDTO;
    }
}
