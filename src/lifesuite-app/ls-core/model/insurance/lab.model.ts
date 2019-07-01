import { ProviderInformationModel } from '../common';
import { DBDate } from '../util';
import { DBDateCrypted } from '../util/dbdate-crypted';

export class LabModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.provider.lab.LabModel, LifeSuite';

    public LabIdNumber: string;

    public LabTypeId: string;

    public DrawnDate: DBDate;

    public LastFood: string;

    public LastFoodTime: string;

    public LastFoodNum: Object;

    public AgencyId: string;

    public SpecialConditions: string;

    public Examiner: string;

    public City: string;

    public State: string;

    public ProcessType: string;

    public UnderwriterCode: string;

    public TestDate: DBDate;

    public BarcodeNumber: string;

    public Ssn: string;

    public BirthDate: DBDateCrypted;

    public Sex: string;

    public LabTransmitDate: DBDate;

    public LabReceiveDate: DBDate;

    public TicketNumber: string;

    public CompanyCode: string;

    public InsTypeLife: string;

    public InsTypeHealth: string;

    public InsTypeDisability: string;

    public InsTypeGroup: string;

    public InsTypeIndividual: string;

    public InsuranceAmount: Object;

    public DrawnDateSerum: DBDate;

    public SignaturePresent: string;

    public PolicyNumber: string;

    public CompletedDate: DBDate;

    public AgentName: string;

    public AgentCity: string;

    public AgentState: string;

    public AgentZip: string;

    public ExaminerCompanyCode: string;

    public ExaminerState: string;

    public SpecialStatusIndicator: string;

    public ApplicantAddress: string;

    public ApplicantZip: string;

    public StateAgent: string;

    public TimeCollected: string;

    public ReferrenceNumber: string;
}
