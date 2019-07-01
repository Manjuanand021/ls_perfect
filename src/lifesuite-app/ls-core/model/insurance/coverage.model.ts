import { BaseModel } from '../core';
import { DBDate } from '../util';

export class CoverageModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.CoverageModel, LifeSuite';

    public PolicyPersonId: Object;

    public CoveragePersonId: Object;

    public PermFlatExtraAmount: Object;

    public TempFlatExtraAmount: Object;

    public TempFlatExtraPeriod: Object;

    public FlatExtraReason: string;

    public TempTableRating: string;

    public TempTableRatingReason: string;

    public RateClassQuoted: string;

    public RateClassApproved: string;

    public RateClassIssued: string;

    public AviationExclusion: Object;

    public PermTableRating: string;

    public PermTableRatingReason: string;

    public PolicyCoverageId: Object;

    public PolicyId: Object;

    public PlanCodeId: string;

    public DeathBenefitOptionCode: string;

    public PurposeOfCoverageId: string;

    public CoverageType: string;

    public IndicatorCode: string;

    public Amount: Object;

    public PremiumMode: string;

    public InvestmentObjective: string;

    public PrefDateOfWithdrawl: DBDate;

    public PlannedPremium: Object;

    public InitialPlannedPremium: Object;

    public EquivalentAge: Object;

    public CanTakeFinalActionFlag: Object;

    public PersonId: Object;

    public RoleId: string;

    public RelationshipToInsuredCode: string;

    public CoverageStatus: string;

    public ReasonText: string;

    public IsSmoker: Object;

    public DividendOption: Object;

    public FinalActionNote: string;

    public BusinessOwnershipPercent: Object;

    public ApprovedAmount: Object;

    public FinalActionById: Object;

    public FinalActionDate: DBDate;

    public EliminationDays: Object;

    public PayoutFrequency: Object;

    public WaitingPeriod: Object;

    public BenefitAmountBasis: Object;

    public GNumber: string;

    public Cola: Object;

    public OwnOcc: Object;

    public SpoAmount: Object;

    public WebQuotedClass: string;

    public ModalPremiumAmount: Object;

    public IssuedTimesStandard: Object;

    public JlsFlag: Object;

    public SplitFlag: Object;

    public SplitDetail: string;

    public ReinsuranceCompanyCode: string;

    public ReinsuranceAmount: Object;

    public RatedUpAge: Object;

    public PaidAmount: Object;

    public EffectiveDate: DBDate;

    public BenefitPeriod: string;

    public EliminationPeriod: string;

    public ApprovedBenefitPeriod: string;

    public ApprovedEliminationPeriod: string;

    public RateClassPriorToRx: string;

    public PastCoverageIndicator: Object;

    public Reg60Indicator: Object;

    public MedicalLoadPercentage: Object;

    public RxLoadPercentage: Object;

    public IndustryLoadPercentage: Object;

    public CopayAmount: string;

    public DeductableAmount: string;

    public CoinsuranceLimit: string;

    public MaxOutPocketAmount: string;

    public HsaIndicator: Object;

    public RxDrugOption: string;

    public JointAge: Object;

    public ApprovedPlanCodeId: string;

    public GuaranteePeriod: string;

    public PpoId: Object;

    public CoverageDuration: Object;

    public DoNotOfferFlag: Object;

    public ExchangeFlag: Object;

    public IssueAge: Object;

    public AutoApprovedDate: DBDate;

    public CoverageNumber: string;

    public DisabilityBenefitInd: Object;

    public EarlyDeathBenefitPercent: Object;

    public MaxInsuranceAmount: Object;
}
