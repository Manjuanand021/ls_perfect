import { BaseDTO } from '../dto/base.dto';
import { DBDate, DBDateCrypted } from '../util';

export class MVRProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.provider.mvr.MVRProxy, LifeSuite';

    public MvrHeaderId: Object;

    public RequirementInformationId: Object;

    public CreateDate: DBDate;

    public ExpirationDate: DBDate;

    public ReportDate: DBDate;

    public State: string;

    public LicenseNumber: string;

    public BirthDate: DBDateCrypted;

    public SocSecNo: string;

    public LicenseStatus: string;

    public LicenseClass: string;

    public IssueDate: DBDate;

    public ExpireDate: DBDate;

    public Restrictions: string;

    public DriverInformation: string;

    public LastName: string;

    public FirstName: string;

    public MiddleName: string;

    public LicenseName: string;

    public LicenseAddress: string;

    public LicenseCityState: string;

    public BatchNumber: string;

    public BatchSequence: string;

    public ModifyDatetime: DBDate;

    public ReportStatus: string;

    public InsuredRequirementId: Object;
}
