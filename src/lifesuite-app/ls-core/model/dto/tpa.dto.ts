import { Identifiable } from './identifiable';
import { TPAModel } from '../insurance/tpa.model';
import { AddressDTO, PhoneDTO } from './index';

export class TPADTO extends TPAModel {
    public static Type: string = 'life.ls.ui.ria.dto.TPADTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = TPADTO.Type;
    public identifier: Identifiable;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public contactName: String;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
