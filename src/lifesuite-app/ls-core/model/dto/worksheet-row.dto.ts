import { Identifiable } from './identifiable';
import { WorksheetRowModel } from '../insurance/worksheet-row.model';

export class WorksheetRowDTO extends WorksheetRowModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.WorksheetRowDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public RateClassDesc: string;
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
