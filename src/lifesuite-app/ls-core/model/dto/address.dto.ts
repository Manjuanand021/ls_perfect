import { Identifiable } from './identifiable';
import { AddressModel } from '../insurance/address.model';

export class AddressDTO extends AddressModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.AddressDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
