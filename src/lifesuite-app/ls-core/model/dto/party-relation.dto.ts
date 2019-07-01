import { Identifiable } from './identifiable';
import { PartyRelationModel } from '../insurance/party-relation.model';
import { AddressDTO, PhoneDTO } from './index';

export class PartyRelationDTO extends PartyRelationModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.PartyRelationDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public IsPrimaryPhysician: boolean;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;
}
