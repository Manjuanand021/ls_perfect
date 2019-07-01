import { BenefitModel } from '../insurance/benefit.model';
import { Identifiable } from './identifiable';
import { BenefitPartyDTO } from 'ls-core/model/dto/benefit-party.dto';

export class BenefitDTO extends BenefitModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.BenefitDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public BenefitParties_LazyLoad: Array<BenefitPartyDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
