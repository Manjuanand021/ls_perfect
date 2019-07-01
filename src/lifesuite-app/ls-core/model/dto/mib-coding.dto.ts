import { Identifiable } from './identifiable';
import { MIBCodingModel } from '../insurance';

export class MIBCodingDTO extends MIBCodingModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MibCodingDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public RateClassDesc: string;
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
