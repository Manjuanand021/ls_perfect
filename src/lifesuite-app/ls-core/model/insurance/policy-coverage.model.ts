import { BaseModel } from '../core';
import { DBDate } from '../util';

export class PolicyCoverageModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.PolicyCoverageModel, LifeSuite';

    public PolicyCoverageId: Object;

    public PolicyId: object;

    public PlanCodeId: string;

    public DeathBenefitOptionCode: string;

    public PurposeOfCoverageId: string;

    public CoverageType: string;

    public IndicatorCode: string;

    public Amount: object;

    public CoverageStatus: string;

    public PremiumMode: string;

    public InvestmentObjective: string;

    public PrefDateOfWithdrawl: DBDate;

    public PlannedPremium: object;

    public InitialPlannedPremium: object;

    public EquivalentAge: object;

    public CanTakeFinalActionFlag: object;

    public TempFlatExtraPeriod: object;

    public PermFlatExtraAmount: object;

    public TempFlatExtraAmount: object;

    public FlatExtraReason: string;

    public TempTableRating: string;

    public TempTableReason: string;

    public PermTableRating: string;

    public PermTableReason: string;

    public DividendOption: object;

    public ApprovedAmount: object;

    public BenefitAmountBasis: object;

    public ModalPremiumAmount: object;
}
