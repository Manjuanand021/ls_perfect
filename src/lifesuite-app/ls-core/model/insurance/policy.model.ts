import { BaseModel } from '../core';
import { DBDate } from '../util';

export class PolicyModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.PolicyModel, LifeSuite';

    public PolicyId: Object;

    public CompanyCode: string;

    public PolicyNumber: string;

    public ApplicationNumber: string;

    public IssueDate: DBDate;

    public UnderwriterId: Object;

    public TeamId: Object;

    public TrialApplicationFlag: Object;

    public ApplicationDate: DBDate;

    public AgentSignedDate: DBDate;

    public PolicyStatusCode: string;

    public PolicyStatusDate: DBDate;

    public ReceiveDate: DBDate;

    public PolicyStatus: string;

    public DirtyFlag: Object;

    public CurrentEditUserId: Object;

    public CurrentEditDate: DBDate;

    public PaymentModeCode: string;

    public LastUnderwriteDate: DBDate;

    public AllowAusApproval: Object;

    public FinalActionDate: DBDate;

    public ReinsuranceIndicator: string;

    public ReinsuranceVendorCode: string;

    public FinalActionNoteId: Object;

    public UpdatedBy: Object;

    public UpdatedDate: DBDate;

    public AddedBy: Object;

    public FinalActionBy: Object;

    public AddedDate: DBDate;

    public CwaAmount: Object;

    public CwaDate: DBDate;

    public PaymentMethodCode: string;

    public Priority: Object;

    public ReasonText: string;

    public FinalActionNote: string;

    public BankRountingNumber: string;

    public BankAccountNumber: string;

    public CreditCardType: string;

    public CreditCardNumber: string;

    public CreditCardAccountName: string;

    public BankAccountName: string;

    public CreditCardExpirationYear: string;

    public CreditCardExpirationMonth: string;

    public ListBillLocation: string;

    public ListBillEmployeeId: string;

    public BillDay: Object;

    public MarketingCode: string;

    public ModePremium: Object;

    public RequestedIssueDate: DBDate;

    public Version: Object;

    public CaseGroupId: string;

    public ServiceAssociateId: Object;

    public AssociationCode: string;

    public TpaCode: string;

    public AmexAccount: string;

    public PerformedJetIssueFlag: Object;

    public SourceInfo: string;

    public LeadNumberId: string;

    public DistributorCode: string;

    public AlternateCaseId: string;

    public CedentPolicyNumber: string;

    public CedentCompanyCode: string;

    public CedentFaxNumber: string;

    public CedentUnderwriterId: Object;

    public CedentContactId: Object;

    public CedentDateSent: DBDate;

    public InternationalOrDomestic: string;

    public IdbFlag: Object;

    public CurrencyCode: string;

    public PreferredLanguageCode: string;

    public PartnerId: string;

    public ApplicationType: string;

    public BankAccountType: string;

    public BackDatePolicy: Object;

    public AgentStaffCode: string;

    public AgentTeamCode: string;

    public CommissionOverride: Object;

    public PpoNetwork: string;

    public EmployerId: Object;

    public GroupIndicator: Object;

    public ProductType: string;

    public TrustCode: string;

    public CaseClockFlag: Object;

    public TiaIndicator: Object;

    public BankTransactionNumber: string;

    public BankNameOnAccount: string;

    public SalesDirectorCode: string;

    public SalesDirectorName: string;

    public BankTransNumIsValidFlag: Object;

    public BankRoutingNumIsValidFlag: Object;

    public MarketingKeyIsValidFlag: Object;

    public CondReceiptNumber: string;

    public ApplicationSourceType: string;

    public BankAccountSequenceId: string;

    public AutoCloseDate: DBDate;

    public Discount1: string;

    public Discount2: string;

    public Discount3: string;

    public Discount4: string;

    public GsiIndicator: Object;

    public PolicyFee: Object;

    public MarketingOrganizationName: string;

    public UwAssignDateTime: DBDate;

    public SaAssignDateTime: DBDate;

    public MecInd: Object;

    public CaseReopenCount: Object;
}
