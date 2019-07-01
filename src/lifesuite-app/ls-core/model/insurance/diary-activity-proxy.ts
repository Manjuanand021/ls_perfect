import { BaseDTO } from '../dto/base.dto';
import { DBDate } from 'ls-core/model';

export class DiaryActivityProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.DiaryActivityProxy, LifeSuite';

    public InsuredNameFull: string;

    public InsuredName: string;

    public db_Name: string;

    public UserId: Object;

    public UserLoginId: string;

    public DiaryDate: DBDate;

    public PolicyId: Object;

    public PolicyNumber: string;

    public InsuredTitle: string;

    public InsuredLastName: string;

    public InsuredMiddleName: string;

    public InsuredFirstName: string;

    public InsuredSuffix: string;

    public Topic: string;

    public TeamId: Object;
}
