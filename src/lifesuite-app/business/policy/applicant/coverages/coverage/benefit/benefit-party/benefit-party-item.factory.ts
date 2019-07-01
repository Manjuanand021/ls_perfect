import { Injectable } from '@angular/core';

import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { BenefitPartyDTO, BenefitDTO } from 'ls-core/model';
import { CreateItemParams } from 'life-core/component/master-detail';
import { Locale } from 'life-core/i18n';

@Injectable()
export class BenefitPartyItemFactory extends BaseDTOItemFactory<BenefitPartyDTO> {
    public newInstance(createItemParams: BenefitPartyCreateItemParams<BenefitPartyDTO>): BenefitPartyDTO {
        const benefitPartyDTO = new BenefitPartyDTO();
        benefitPartyDTO.BenefitId = createItemParams.benefit.BenefitId;
        benefitPartyDTO.PolicyCoverageId = createItemParams.benefit.PolicyCoverageId;
        benefitPartyDTO.PersonTypeId = 'Person';
        benefitPartyDTO.PreferredLanguageCode = Locale.en_US.toLowerCase();
        benefitPartyDTO.Addresses_LazyLoad = [];
        benefitPartyDTO.Phones_LazyLoad = [];
        benefitPartyDTO.Relations_LazyLoad = [];
        benefitPartyDTO.PartyId = this.getNextId(createItemParams.items, 'PartyId');
        // benefitPartyDTO.PersonId = this.getNextId(createItemParams.items, "PersonId");
        return benefitPartyDTO;
    }
}

export interface BenefitPartyCreateItemParams<T> extends CreateItemParams<T> {
    benefit: BenefitDTO;
}
