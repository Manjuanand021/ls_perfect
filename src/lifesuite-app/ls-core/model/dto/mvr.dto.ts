import { Identifiable } from './identifiable';
import { MVRModel } from 'ls-core/model/insurance/mvr.model';
import { MVRDetailDTO } from 'ls-core/model';

export class MVRDTO extends MVRModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MVRDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public Details_LazyLoad: Array<MVRDetailDTO>;
}
