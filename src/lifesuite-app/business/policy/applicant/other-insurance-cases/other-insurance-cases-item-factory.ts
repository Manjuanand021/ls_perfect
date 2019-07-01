import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { RelatedPolicyDTO } from 'ls-core/model/dto';

@Injectable()
export class OtherInsuranceCasesItemFactory extends BaseDTOItemFactory<RelatedPolicyDTO> {
    public newInstance(createItemParams: RelatedPolicyCreateItemParams<RelatedPolicyDTO>): RelatedPolicyDTO {
        const relatedPolicyDTO = new RelatedPolicyDTO();
        relatedPolicyDTO.SequenceNumber = this.getNextId(createItemParams.items, 'SequenceNumber');
        relatedPolicyDTO.PolicyPersonId = createItemParams.policyPersonId;
        return relatedPolicyDTO;
    }
}
export interface RelatedPolicyCreateItemParams<T> extends CreateItemParams<T> {
    policyPersonId: any;
}
