import { Identifiable } from './identifiable';
import { AddressDTO } from './address.dto';
import { PhoneDTO } from './phone.dto';
import { PartyRelationDTO } from './party-relation.dto';
import { BeneficiaryModel } from '../insurance/beneficiary.model';

export class BeneficiaryDTO extends BeneficiaryModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.BeneficiaryDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public IrrevokableIndicatorDescription: string;

    public RelationShipDescription: string;

    public RoleDescription: string;

    public BenefitTypeDescription: string;

    public Addresses_LazyLoad: Array<AddressDTO>;

    public Phones_LazyLoad: Array<PhoneDTO>;

    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
