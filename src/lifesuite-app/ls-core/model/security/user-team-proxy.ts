import { BaseDTO } from '../dto/base.dto';

export class UserTeamProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.security.UserTeamProxy, LifeSuite';

    public UserId: Object;

    public TeamId: Object;

    public TeamName: string;

    public Description: string;

    public IsActive: Object;

    public AutoAssign: Object;

    public Deleted: Object;
}
