import { Identifiable } from './identifiable';
import { PayorModel } from '../insurance/payor.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO } from './index';

export class PayorDTO extends PayorModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.PayorDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;
    public isPrimaryInsured: boolean;
}
