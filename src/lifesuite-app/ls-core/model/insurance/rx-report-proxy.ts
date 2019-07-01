import { BaseDTO } from '../dto/base.dto';
import { DBDate } from '../util';

export class RXReportProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.RXReportProxy, LifeSuite';

    public RXReportProxyId: number; // Auto Id. For use in UI only.

    public ReportDate: DBDate;

    public Ssno: string;

    public CompanyName: string;

    public CompanyAddress: string;

    public InsuredState: string;

    public PolicyNumber: Object;

    public Requestor: string;

    public BirthDate: string;

    public SexState: string;

    public AccountCode: Object;

    public TicketNumber: Object;

    public DrugName: string;

    public Quantity: Object;

    public PhyscianName: string;

    public DaysSupply: Object;

    public Speciality: string;

    public Therapeutic: string;

    public Indications: Object;

    public PhyscianAddress: string;

    public PhyscianPhone: string;

    public PhyscianSpecialty: string;

    public TotalRefillsAllowed: Object;

    public FillDate: DBDate;

    public PharmacyId: string;

    public DrugBrandName: string;

    public AddedDate: DBDate;

    public DrugPriority: string;

    public DrugWeight: Object;

    public ClientScore: Object;

    public NbrFillsDrugName: Object;

    public InsuredLastName: string;

    public InsuredFirstName: string;

    public PrescriptionDrugHeaderId: Object;

    public OrderReference: string;

    public AlternateOrderReference: string;

    public OrderResultStatus: string;

    public OrderResultsUrl: string;

    public ImageExtractIndicator: Object;

    public ImageType: string;

    public ImageFileName: string;

    public ApplicantRelationship: string;

    public ApplicantResultStatus: string;

    public PrescriptionFillCount: Object;

    public MillimanAccount: string;
}
