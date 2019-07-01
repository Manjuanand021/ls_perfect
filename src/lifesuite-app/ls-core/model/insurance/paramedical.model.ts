import { DBDate } from '../util';
import { ProviderInformationModel } from '../common';

export class ParamedicalModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.provider.mib.ParamedicalModel, LifeSuite';
    public BarcodeNumber: string;
    public Birthdate: DBDate; // C01
    public Sex: string;
    public Title: string;
    public Suffix: string;
    public TaxIdNo: string;
    public AgencyNumber: string;
    public AgencyName: string;
    public AgentNumber: string;
    public AgentName: string;
    public ExtractDate: DBDate; // C02
    public ExtractFileName: string;
    public ImportDate: DBDate; // C02
    public AddedDate: DBDate; // C02
    public UpdateDate: DBDate; // C02
    public UpdatedBy: object;
    public PolicyPersonId: object;
    public DoctorName: string;
    public DoctorAddr: string;
    public DoctorCity: string;
    public DoctorState: string;
    public DoctorZip: string;
    public LastVisitDate: DBDate; // C02
    public VisitReason: string;
    public Findings: string;
    public Treatments: string;
    public StillUnderTreatmentFlag: object;
    public PriorConsultationsFlag: object;
    public PriorConsultationDetail: string;
    public ManualEntryFlag: object;
    public HeightInches: object;
    public DidYouWeighFlag: object;
    public DidYouMeasureFlag: object;
    public WeightPounds: object;
    public WeightLossGain: object;
    public WeightChangeReason: string;
    public WaistSize: object;
    public ChestExhale: object;
    public ChestInhale: object;
    public Systolic: object;
    public Diastolic: object;
    public Pulse: object;
    public ExamCompanyNumber: string;
    public ExamCompanyName: string;
    public ExaminerNumber: string;
    public ExaminerName: string;
    public AreYouADoctorFlag: object;
    public AnyAnsweredYes: object;
    public AnyAdditionalInformation: object;
    public AnyUnansweredQuestions: object;
    public AnyUnderlinedWords: object;
}
