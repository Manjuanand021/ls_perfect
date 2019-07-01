import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { ListUtil } from 'life-core/util';
import { PartyRelationDTO, AddressDTO, AddressTypes, PhoneDTO, PhoneTypes } from 'ls-core/model';
import { DBDate } from 'ls-core/model';

@Injectable()
export class PhysicianInformationItemFactory extends BaseDTOItemFactory<PartyRelationDTO> {
    public newInstance(createItemParams: CreateItemParams<PartyRelationDTO>): PartyRelationDTO {
        const partyRelationDTO = new PartyRelationDTO();
        const businessAddress = new AddressDTO();
        businessAddress.AddressTypeCode = AddressTypes.BUSINESS;
        partyRelationDTO.Addresses_LazyLoad = [businessAddress];
        const workPhone = new PhoneDTO();
        workPhone.PhoneTypeCode = PhoneTypes.BUSINESS;
        partyRelationDTO.Phones_LazyLoad = [workPhone];
        partyRelationDTO.PersonId = this.getNextId(createItemParams.items, 'PersonId');
        return partyRelationDTO;
    }
}
