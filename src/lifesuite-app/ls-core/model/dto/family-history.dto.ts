import { Identifiable } from './identifiable';
import { FamilyHistoryModel } from '../insurance/family-history.model';

export class FamilyHistoryDTO extends FamilyHistoryModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.FamilyHistoryDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;
    public Description: string;
}
