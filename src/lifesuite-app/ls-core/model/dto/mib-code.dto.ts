import { Identifiable } from './identifiable';
import { MIBCodeModel } from '../insurance';

export class MIBCodeDTO extends MIBCodeModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MIBCodeDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public RateClassDesc: string;
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
