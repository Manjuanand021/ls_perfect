import { Identifiable } from './identifiable';
import { MIBCodeDTO } from './mib-code.dto';
import { MIBModel } from '../insurance';

export class MIBDTO extends MIBModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.MIBDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public RateClassDesc: string;

    public Codes_LazyLoad: Array<MIBCodeDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
