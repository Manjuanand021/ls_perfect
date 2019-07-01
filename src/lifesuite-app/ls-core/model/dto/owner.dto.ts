import { Identifiable } from './identifiable';
import { OwnerModel } from '../insurance/owner.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO } from './index';

export class OwnerDTO extends OwnerModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.OwnerDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public isPrimaryInsured: boolean;
}
