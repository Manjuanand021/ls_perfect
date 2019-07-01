import { Identifiable } from './identifiable';
import { ImpairmentRestrictionModel } from '../insurance/impairment-restriction.model';

export class ImpairmentRestrictionDTO extends ImpairmentRestrictionModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ImpairmentRestrictionDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
