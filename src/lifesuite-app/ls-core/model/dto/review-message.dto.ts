import { Identifiable } from './identifiable';
import { ReviewMessageModel } from '../insurance/review-message.model';
import { NoteDTO } from './note.dto';

export class ReviewMessageDTO extends ReviewMessageModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ReviewMessageDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;
    public reviewNote: NoteDTO;
}
