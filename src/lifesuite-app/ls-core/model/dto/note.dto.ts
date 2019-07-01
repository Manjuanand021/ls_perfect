import { Identifiable } from './identifiable';
import { NoteModel } from '../insurance/note.model';

export class NoteDTO extends NoteModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.NoteDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;
    public SupplementalNotes: Array<NoteDTO>;
    public UserType: number;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
