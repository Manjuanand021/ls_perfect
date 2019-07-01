import { Identifiable } from './identifiable';
import { VelogicaModel } from '../insurance/velogica.model';
import { VelogicaDetailDTO } from './velogica-detail.dto';

export class VelogicaDTO extends VelogicaModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.VelogicaDTO, public LifeSuite.public UIServiceDTO';

    public identifier: Identifiable;

    public Details_LazyLoad: Array<VelogicaDetailDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
