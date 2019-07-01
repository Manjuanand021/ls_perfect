import { Identifiable } from './identifiable';
import { CoverageModel } from '../insurance/coverage.model';
import {
    AmendmentDTO,
    ImpairmentRestrictionDTO,
    ReinsurerDTO,
    WorksheetRowDTO,
    BeneficiaryDTO,
    FundAllocationDTO
} from './index';

export class CoverageDTO extends CoverageModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.CoverageDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Beneficiaries_LazyLoad: Array<BeneficiaryDTO>;
    public FundAllocations_LazyLoad: Array<FundAllocationDTO>;
    public WorksheetRows_LazyLoad: Array<WorksheetRowDTO>;
    public ImpairmentRestrictions_LazyLoad: Array<ImpairmentRestrictionDTO>;
    public Amendments_LazyLoad: Array<AmendmentDTO>;
    // public CoverageExtInfos_LazyLoad: Array<>;
    public Reinsurers_LazyLoad: Array<ReinsurerDTO>;

    public issueAge: number;

    public planName: string;

    public isClosed: boolean;

    public Disposition: string;

    public CoverageStatusDescription: string;

    public FinalActionByFullName: string;

    public RateClassApprovedDescription: string;

    public CalculatedPointsRateClass: number;

    public FundAllocations: Array<any>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
