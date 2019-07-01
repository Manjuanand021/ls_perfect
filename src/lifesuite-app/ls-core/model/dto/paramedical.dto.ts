import { Identifiable } from './identifiable';
import { ParamedicalModel } from '../insurance';

export class ParamedicalDTO extends ParamedicalModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ParamedicalDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
