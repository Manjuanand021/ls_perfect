import { Identifiable } from './identifiable';
import { LabCommentModel } from '../insurance/lab-comment.model';

export class LabCommentDTO extends LabCommentModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.LabCommentDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
