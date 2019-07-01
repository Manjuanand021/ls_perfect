import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { MIBCodingDTO, DBDate } from 'ls-core/model';
import { MIBMasterGridNodeIds } from '../mib.resources';

@Injectable()
export class MIBCodingItemFactory extends BaseDTOItemFactory<MIBCodingDTO> {
    public newInstance(createItemParams: MIBCodingCreateItemParams<MIBCodingDTO>): MIBCodingDTO {
        const mibCodingDTO = new MIBCodingDTO();
        // (policy_person_id,sequence_number) are composite primary key in mib_coding table
        mibCodingDTO.SequenceNumber = this.getNextId(createItemParams.items, MIBMasterGridNodeIds.SequenceNumber);
        mibCodingDTO.PolicyPersonId = createItemParams.policyPersonId;
        mibCodingDTO.EffectiveDate = createItemParams.effectiveDate;
        mibCodingDTO.MibValidationResult = 0;
        mibCodingDTO.MibTranslationResult = null;
        return mibCodingDTO;
    }
}

export interface MIBCodingCreateItemParams<T> extends CreateItemParams<T> {
    policyPersonId: any;
    effectiveDate: DBDate;
}
