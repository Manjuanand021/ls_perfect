import { Identifiable, AddressDTO, PhoneDTO, PartyRelationDTO } from 'ls-core/model';
import { BenefitPartyModel } from 'ls-core/model/insurance/benefit-party.model';

export class BenefitPartyDTO extends BenefitPartyModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.BenefitPartyDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
