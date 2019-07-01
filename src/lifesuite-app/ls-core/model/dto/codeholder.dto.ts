import { CodeHolderModel } from '../core/codeholder.model';
import { IIdentifiable, Identifiable } from './identifiable';

export class CodeHolderDTO extends CodeHolderModel implements IIdentifiable {
    public $type: string = 'life.ls.ui.ria.dto.CodeHolderDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
