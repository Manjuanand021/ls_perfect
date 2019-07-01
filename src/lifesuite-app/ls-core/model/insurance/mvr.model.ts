import { ProviderInformationModel } from '../common';
import { DBDate } from 'ls-core/model';

export class MVRModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.insurance.core.MvrModel, LifeSuite';

    public MvrHeaderId: Object;

    public ReportDate: DBDate;

    public State: string;

    public LicenseNumber: string;

    public BirthDate: DBDate;

    public SocSecNo: string;

    public LicenseStatus: string;

    public LicenseClass: string;

    public IssueDate: DBDate;

    public ExpireDate: DBDate;

    public Restrictions: string;

    public DriverInformation: string;

    public LicenseName: string;

    public LicenseAddress: string;

    public LicenseCityState: string;

    public BatchNumber: string;

    public BatchSequence: string;

    public ModifyDatetime: DBDate;

    public ReportStatus: string;
}
