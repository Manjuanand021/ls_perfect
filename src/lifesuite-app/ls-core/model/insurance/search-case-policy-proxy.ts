import { BaseDTO } from '../dto/base.dto';
import { DateRange } from 'life-core/component/input';

export class SearchCasePolicyProxy extends BaseDTO {
    constructor() {
        super();
        this.PolicyNumber = '';
        this.InsuredFirstName = '';
        this.InsuredLastName = '';
        this.ApplicantStatus = '';
        this.AddedDate = null;
        this.InsuredTaxId = '';
        this.InsuredBirthDate = null;
        this.AlternateCaseId = '';
        this.CaseGroupId = '';
        this.ApplicantStatusDate = null;
        this.ReceiveDate = null;
        this.ReopenDate = null;
        this.InsuredClientId = '';
        this.AgentNumber = '';
        this.TeamName = '';
        this.UnderwriterName = '';
        this.ServiceAssociateName = '';
        this.ApplicationSourceType = '';
        this.CountryId = '';
        this.CountryStateId = '';
        this.MarketingCode = '';
    }

    public PolicyNumber: string;

    public InsuredFirstName: string;

    public InsuredLastName: string;

    public ApplicantStatus: string;

    public AddedDate: DateRange;

    public InsuredTaxId: string;

    public InsuredBirthDate: DateRange;

    public AlternateCaseId: string;

    public CaseGroupId: string;

    public ApplicantStatusDate: DateRange;

    public ReceiveDate: DateRange;

    public ReopenDate: DateRange;

    public InsuredClientId: string;

    public AgentNumber: string;

    public AgencyNumber: string;

    public TeamName: string;

    public UnderwriterName: string;

    public ServiceAssociateName: string;

    public ApplicationSourceType: string;

    public CountryId: string;

    public CountryStateId: string;

    public MarketingCode: string;
}
