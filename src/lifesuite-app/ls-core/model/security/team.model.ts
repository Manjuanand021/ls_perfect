import { BaseModel } from '../core/base.model';

export class TeamModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.security.TeamModel, LifeSuite';

    public TeamId: Object;

    public TeamName: string;

    public Description: string;

    public IsActive: Object;

    public Deleted: Object;

    public LastReqAssignmentUser: Object;
}
