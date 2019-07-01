import { Identifiable } from './identifiable';
import { ScratchPadModel } from '../insurance/scratch-pad.model';

export class ScratchPadDTO extends ScratchPadModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ScratchPadDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
