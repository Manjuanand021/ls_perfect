import { Identifiable } from './identifiable';
import { AmendmentModel } from '../insurance/amendment.model';

export class AmendmentDTO extends AmendmentModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.AmendmentDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
