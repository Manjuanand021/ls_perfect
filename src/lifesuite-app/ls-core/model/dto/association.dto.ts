import { Identifiable } from './identifiable';
import { CompanyModel } from '../insurance/employer.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO } from './index';

export class AssociationDTO extends CompanyModel {
    public static Type: string = 'life.ls.ui.ria.dto.AssociationDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = AssociationDTO.Type;

    public identifier: Identifiable;
    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;
    public contactName: String;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
