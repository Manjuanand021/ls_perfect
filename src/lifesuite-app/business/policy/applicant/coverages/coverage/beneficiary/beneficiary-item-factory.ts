import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { BeneficiaryDTO, PartyTypes } from 'ls-core/model';

export const BeneficiaryType = {
    Primary: '0',
    DeathBenefit: 'Death Benefit'
};

@Injectable()
export class BeneficiaryItemFactory extends BaseDTOItemFactory<BeneficiaryDTO> {
    public newInstance(createItemParams: CreateItemParams<BeneficiaryDTO>): BeneficiaryDTO {
        const beneficiary = new BeneficiaryDTO();
        beneficiary.CoveragePersonId = this.getNextId(createItemParams.items, 'CoveragePersonId');
        beneficiary.PersonTypeId = PartyTypes.PERSON;
        beneficiary.BenefitType = BeneficiaryType.DeathBenefit;
        beneficiary.BeneficiaryType = BeneficiaryType.Primary;
        return beneficiary;
    }
}
