import { BaseDTO } from '../dto/base.dto';
import { DBDate, DBDateCrypted } from '../util';

export class PolicyProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.PolicyProxy, LifeSuite';

    public InsuredNameFull: string;

    public InsuredName: string;

    public InsuredNameShort: string;

    public UnderwriterName: string;

    public UnderwriterNameShort: string;

    public ServiceAssociateName: string;

    public ServiceAssociateNameShort: string;

    public ApplicantStatus: string;

    public UnderwriterLastName: string;

    public UnderwriterFirstName: string;

    public Agent: string;

    public Agency: string;

    public FaceAmount: string;

    public Association: string;

    public policyid: string;

    public ServiceAssociateLastName: string;

    public ServiceAssociateFirstName: string;

    public TeamName: string;

    public CedentCompanyName: string;

    public EmployerName: string;

    public IsPrimaryInsured: boolean;

    public DefaultView: string;

    public db_Name: string;

    public CompanyCode: string;

    public PolicyId: Object;

    public PolicyNumber: string;

    public Priority: Object;

    public PolicyStatusCode: string;

    public PolicyStatusDate: DBDate;

    public PolicyPersonId: Object;

    public InsuredTitle: string;

    public InsuredLastName: string;

    public InsuredMiddleName: string;

    public InsuredFirstName: string;

    public InsuredSuffix: string;

    public InsuredTaxId: string;

    public InsuredBirthDate: DBDateCrypted;

    public InsuredClientId: string;

    public InsuredUnderwritingAmount: Object;

    public ApplicationDate: DBDate;

    public ApplicationNumber: string;

    public AddedDate: DBDate;

    public ReceiveDate: DBDate;

    public ReopenDate: DBDate;

    public UnderwriterId: Object;

    public AgencyPersonId: Object;

    public UnderwriterLoginId: string;

    public TeamId: Object;

    public UserId: Object;

    public AccessDateTime: DBDate;

    public PartyId: Object;

    public CaseGroupId: string;

    public ServiceAssociateId: Object;

    public ServiceAssociateLoginId: string;

    public AssociationCode: string;

    public ApplicantStatusShort: string;

    public ApplicantStatusDate: DBDate;

    public IsMember: Object;

    public AdverseHistory: Object;

    public TpaCode: string;

    public PrimaryPlanCode: string;

    public RelationshipToInsured: string;

    public CedentPolicyNumber: string;

    public CedentCompanyCode: string;

    public CedentUnderwriterId: Object;

    public CedentContactId: Object;

    public CedentDateSent: DBDate;

    public InternationalOrDomestic: string;

    public IdbFlag: Object;

    public CurrencyCode: string;

    public UwRmCount: Object;

    public OpenPiReq: Object;

    public EmployerId: Object;

    public AlternateCaseId: string;

    public SourceInfo: string;

    public DistributorCode: string;

    public AgencyNumber: string;

    public AgentNumber: string;

    public BankTransactionNumber: string;

    public BankNameOnAccount: string;

    public SalesDirectorCode: string;

    public SalesDirectorName: string;

    public CaseViewApplicantCount: Object;

    public PrimaryInsuredFlag: Object;

    public AgentLastName: string;

    public AgentFirstName: string;

    public UpdatedDate: DBDate;

    public StateName: string;

    public CountryName: string;

    public RequirementInformationId: Object;
}
