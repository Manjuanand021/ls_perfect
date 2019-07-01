import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { BenefitDTO } from 'ls-core/model';

@Injectable()
export class BenefitItemFactory extends BaseDTOItemFactory<BenefitDTO> {
    public newInstance(createItemParams: CreateItemParams<BenefitDTO>): BenefitDTO {
        let benefitDTO = new BenefitDTO();
        benefitDTO.BenefitId = this.getNextId(createItemParams.items, "BenefitId");
        return benefitDTO;
    }
}