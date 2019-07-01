import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { MedicationDTO } from 'ls-core/model';

@Injectable()
export class RxOtherMedicationItemFactory extends BaseDTOItemFactory<MedicationDTO> {
    public newInstance(createItemParams: CreateItemParams<MedicationDTO>): MedicationDTO {
        const medicationDTO = new MedicationDTO();
        medicationDTO.MedicationId = this.getNextId(createItemParams.items, 'MedicationId');
        return medicationDTO;
    }
}
