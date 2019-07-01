import { Identifiable } from './identifiable';
import { BisOkDocumentModel } from '../insurance/bis-ok-document.model';

export class BisOkDocDTO extends BisOkDocumentModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.BisOkDocDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }

    public PolicyId: number;

    public LinkUrl: string;

    public deleteImg: string;
}
