import { Identifiable } from './identifiable';
import { PhoneModel } from '../insurance/phone.model';
export class PhoneDTO extends PhoneModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.PhoneDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
