import { BaseDTO } from '../dto/base.dto';
import { DBDate, DBDateCrypted } from '../util';

export class RequirementProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.RequirementProxy, LifeSuite';

    public InsuredNameFull: string;

    public InsuredName: string;

    public ServiceAssociateName: string;

    public ServiceAssociateLastName: string;

    public ServiceAssociateFirstName: string;

    public db_Name: string;

    public RequirementName: string;

    public RequirementCode: string;

    public RequirementTypeId: string;

    public RequirementCategory: Object;

    public FollowupDate: DBDate;

    public ClosedDate: DBDate;

    public ReceivedDate: DBDate;

    public PolicyId: Object;

    public PolicyNumber: string;

    public PolicyStatusCode: string;

    public UnderwriterId: Object;

    public UnderwriterLoginId: string;

    public InsuredRequirementId: Object;

    public ClosedDisposition: string;

    public RequirementInformationId: Object;

    public InsuredTitle: string;

    public InsuredLastName: string;

    public InsuredMiddleName: string;

    public InsuredFirstName: string;

    public InsuredSuffix: string;

    public BirthDate: DBDateCrypted;

    public TaxId: string;

    public TeamId: Object;

    public LastFollowupDate: DBDate;

    public ManualOrAutomaticEntry: string;

    public NewBusinessUntilClosed: Object;

    public ProviderOrderId: Object;

    public ServiceAssociateId: Object;

    public ServiceAssociateLoginId: string;

    public AltLang: string;

    public AltName: string;

    public DefaultOrderedBy: string;

    public OrderedDate: DBDate;

    public PartyId: Object;

    public PolicyPersonId: Object;

    public Provider: string;

    public EvidenceType: string;

    public CreateComment: string;

    public OrderedBy: string;

    public OrderedById: Object;

    public OrderedByTeam: string;

    public AgentNumber: string;

    public AlwaysOrder: string;

    public UnderwriterLastName: string;

    public UnderwriterFirstName: string;

    public UnderwriterNameShort: string;
}
