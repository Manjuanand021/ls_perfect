import { Identifiable } from './identifiable';
import { AgentModel } from '../insurance/agent.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO } from './index';

export class AgentDTO extends AgentModel {
    public static Type: string = 'life.ls.ui.ria.dto.AgentDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = AgentDTO.Type;

    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
