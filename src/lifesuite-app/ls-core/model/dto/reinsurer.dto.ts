import { Identifiable } from './identifiable';
import { ReinsurerModel } from '../insurance/reinsurer.model';

export class ReinsurerDTO extends ReinsurerModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ReinsurerDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
