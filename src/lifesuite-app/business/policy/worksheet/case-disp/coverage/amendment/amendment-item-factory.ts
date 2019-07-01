import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { AmendmentDTO } from 'ls-core/model';

@Injectable()
export class AmendmentItemFactory extends BaseDTOItemFactory<AmendmentDTO> {
    public newInstance(createItemParams: AmendmentCreateItemParams<AmendmentDTO>): AmendmentDTO {
        const amendmentDTO = new AmendmentDTO();
        amendmentDTO.CoveragePersonAmendmentId = this.getNextId(createItemParams.items, 'CoveragePersonAmendmentId');
        amendmentDTO.CoveragePersonId = createItemParams.coveragePersonId;
        return amendmentDTO;
    }
}

export interface AmendmentCreateItemParams<T> extends CreateItemParams<T> {
    coveragePersonId: any;
}