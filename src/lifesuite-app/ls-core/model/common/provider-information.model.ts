import { BaseModel } from '../core/base.model';
import { DBDate } from '../util';

export class ProviderInformationModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.ProviderInformation, LifeSuite';

    public RequirementInformationId: Object;

    public CreateDate: DBDate;

    public MatchMethod: Object;

    public Status: string;

    public VendorId: string;

    public ManualOrElectronicEntry: string;

    public ExpirationDate: DBDate;

    public AddedBy: Object;

    public RequirementTypeId: string;

    public RequirementRequestId: Object;

    public LifespanDays: Object;

    public LastName: string;

    public FirstName: string;

    public MiddleName: string;

    public InsuredRequirementId: Object;
}
