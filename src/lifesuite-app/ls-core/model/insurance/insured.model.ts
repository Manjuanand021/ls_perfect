import { PartyModel } from '../common';
import { DBDate } from '../util';

export class InsuredModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.InsuredModel, LifeSuite';

    public PolicyPersonId: Object;

    public SignedStateId: string;

    public UnderwritingAmount: Object;

    public AddUwAmt: Object;

    public PrimaryInsuredFlag: Object;

    public AviationExclusion: Object;

    public PolicyId: Object;

    public RoleId: string;

    public SubRoleId: string;

    public RelationshipToInsured: string;

    public ApplicantStatus: string;

    public ApplicantStatusDate: DBDate;

    public IsMember: Object;

    public AllowAutoApproval: Object;

    public AdverseHistory: Object;

    public UndAllowAutoApproval: Object;

    public UndAllowJetIssue: Object;

    public UndAllowAutoOrdering: Object;

    public AddedBy: Object;

    public AddedDate: DBDate;

    public ReopenDate: DBDate;

    public RetroType: string;

    public AviationFlag: Object;

    public EntertainerFlag: Object;

    public SportsFlag: Object;

    public ForeignFlag: Object;

    public AdditionalInForce: Object;

    public SignedCountryId: string;

    public RxThreshold: Object;

    public PrimaryReferenceId: Object;

    public MedicalCoverageIndicator: Object;

    public DentalCoverageIndicator: Object;

    public VisionCoverageIndicator: Object;

    public AlphaSearch: Object;

    public OccupationRateClass: string;

    public ApplicantSignatureType: string;
}
