import { Identifiable } from './identifiable';
import { AgencyModel } from '../insurance/agency.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO } from './index';

export class AgencyDTO extends AgencyModel {
    public static Type: string = 'life.ls.ui.ria.dto.AgencyDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = AgencyDTO.Type;

    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
