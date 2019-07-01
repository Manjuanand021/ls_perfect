import { Identifiable } from './identifiable';
import { PolicyCoverageModel } from '../insurance/policy-coverage.model';
import { BenefitDTO } from './index';

export class PolicyCoverageDTO extends PolicyCoverageModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.PolicyCoverageDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Benefits_LazyLoad: Array<BenefitDTO>;
    // public SubAccounts_LazyLoad: Array<>;
    // public RateClasses_LazyLoad: Array<>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
