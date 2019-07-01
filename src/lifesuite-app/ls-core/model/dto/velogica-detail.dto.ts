import { Identifiable } from './identifiable';
import { VelogicaModel } from '../insurance/velogica.model';

export class VelogicaDetailDTO extends VelogicaModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.VelogicaDetailDTO, public LifeSuite.public UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
