import { Identifiable } from './identifiable';
import { MedicalConditionModel } from '../insurance/medical-condition.model';
import { NoteDTO } from './note.dto';

export class MedicalConditionDTO extends MedicalConditionModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MedicalConditionDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Note: NoteDTO;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
