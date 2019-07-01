import { BaseModel } from '../core/base.model';

export class RoleModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.security.RoleModel, LifeSuite';

    public RoleId: Object;

    public Name: string;

    public Description: string;

    public IsActive: Object;

    public Deleted: Object;
}
