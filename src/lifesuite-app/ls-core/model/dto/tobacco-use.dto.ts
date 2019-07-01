import { Identifiable } from './identifiable';
import { TobaccoUseModel } from '../insurance/tobacco-use.model';

export class TobaccoUseDTO extends TobaccoUseModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.TobaccoUseDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;
}
