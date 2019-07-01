import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { MedicalConditionDTO } from 'ls-core/model';

@Injectable()
export class MedicalConditionItemFactory extends BaseDTOItemFactory<MedicalConditionDTO> {
    public newInstance(createItemParams: CreateItemParams<MedicalConditionDTO>): MedicalConditionDTO {
        const medicalConditionDTO = new MedicalConditionDTO();
        medicalConditionDTO.MedicalConditionId = this.getNextId(createItemParams.items, 'MedicalConditionId');
        return medicalConditionDTO;
    }
}
