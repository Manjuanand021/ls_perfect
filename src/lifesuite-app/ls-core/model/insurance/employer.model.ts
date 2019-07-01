import { PartyModel } from '../common';
import { DBDate } from '../util';

export class CompanyModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.core.CompanyModel, LifeSuite';

    public CompanyCode: string;

    public AllowAusApprovalFlag: object;

    public CorrespondenceDirectory: string;

    public FullTimeEmployeeCount: object;

    public PercentEligibleEmployees: object;

    public PercentEligibleDependants: object;

    public CurrentCobraIndicator: object;

    public ExpirationDate: DBDate;
}
