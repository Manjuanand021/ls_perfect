import { Identifiable } from './identifiable';
import { ApplicationInfoModel } from '../insurance/application-info.model';
import { FamilyHistoryDTO, TobaccoUseDTO, MedicationDTO } from './index';

export class ApplicationInfoDTO extends ApplicationInfoModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ApplicationInfoDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public FamilyHistories_LazyLoad: Array<FamilyHistoryDTO>;
    public TobaccoUses_LazyLoad: Array<TobaccoUseDTO>;
    public Medication_LazyLoad: Array<MedicationDTO>;
}
