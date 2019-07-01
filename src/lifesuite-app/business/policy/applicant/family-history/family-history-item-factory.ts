import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { ListUtil } from 'life-core/util';
import { FamilyHistoryDTO } from 'ls-core/model/dto';
import { DBDate } from 'ls-core/model';

@Injectable()
export class FamilyHistoryItemFactory extends BaseDTOItemFactory<FamilyHistoryDTO> {
    public newInstance(createItemParams: CreateItemParams<FamilyHistoryDTO>): FamilyHistoryDTO {
        const familyHistoryDTO = new FamilyHistoryDTO();
        familyHistoryDTO.FamilyHistoryId = this.getNextId(createItemParams.items, "FamilyHistoryId");
        return familyHistoryDTO;
    }
}