import { Identifiable } from './identifiable';
import { EvidenceStatusModel } from '../insurance/evidence-status.model';

export class EvidenceStatusDTO extends EvidenceStatusModel {
    public static Type: string = 'life.ls.ui.ria.dto.EvidenceStatusDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = EvidenceStatusDTO.Type;

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
