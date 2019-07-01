import { PartyModel } from '../common';
import { DBDate } from '../util';

export class AssociationModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.core.AssociationModel, LifeSuite';

    public AssociationCode: String;

    // public EmployerShortName: String;

    public CompanyCode: string;

    public AllowAusApprovalFlag: object;

    public CorrespondenceDirectory: string;

    public FullTimeEmployeeCount: object;

    public PercentEligibleEmployees: object;

    public PercentEligibleDependants: object;

    public CurrentCobraIndicator: object;

    public ExpirationDate: DBDate;

    public ExcludeFromDropdown: object;
}
