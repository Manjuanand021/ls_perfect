import { Identifiable } from './identifiable';
import { MedicationModel } from '../insurance/medication.model';

export class MedicationDTO extends MedicationModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MedicationDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
