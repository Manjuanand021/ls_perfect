import { Identifiable } from './identifiable';
import { LabResultModel } from '../insurance/lab-result.model';

export class LabResultDTO extends LabResultModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.LabResultDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
