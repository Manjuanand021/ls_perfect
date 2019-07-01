import { Identifiable } from './identifiable';
import { FundAllocationModel } from '../insurance/fund-allocation.model';

export class FundAllocationDTO extends FundAllocationModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.FundAllocationDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
