import { Identifiable } from './identifiable';
import { MVRDetailModel } from 'ls-core/model/insurance/mvr-detail.model';

export class MVRDetailDTO extends MVRDetailModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MVRDetailDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
