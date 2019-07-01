import { BaseModel } from '../core/base.model';
import { DBDate } from '../util';

export class RelatedPolicyModel extends BaseModel {
    public PolicyPersonId: Object;

    public SequenceNumber: Object;

    public Company: String;

    public PolicyNumber: String;

    public Status: String;

    public Amount: Object;

    public ReplacementFlag: Object;

    public ReplacementDate: DBDate;

    public CommentText: String;

    public Relationship: String;

    public RelationType: Object;

    public AdbAmount: Object;

    public IssueDate: DBDate;

    public PurposeOfCoverage: String;

    public UnderwriteFlag: Object;

    public LineOfBusiness: String;

    public BenefitPeriod: String;

    public EliminationPeriod: String;

    public EmployerPaidPercent: Object;

    public ReplacementType: String;

    public PersonId: Object;

    public ReinsuranceAmount: Object;

    public BillStatus: String;

    public ReinsuranceType: String;

    public Decision: Object;

    public ProductName: String;

    public RateClass: String;

    public TableRating: String;

    public FlatExtraAmount: Object;

    public FlatExtraPeriod: Object;

    public Activity: String;

    public ActivityDate: DBDate;
}
