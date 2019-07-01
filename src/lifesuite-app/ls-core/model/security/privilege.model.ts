import { BaseModel } from '../core/base.model';

export class PrivilegeModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.security.PrivilegeModel, LifeSuite';

    public LsResolveUtilRoleId: Object;

    public LsResolveUtilPrivilegeId: Object;

    public LsResolveUtilName: string;

    public LsResolveUtilDescription: string;

    public LsResolveUtilIsActive: Object;

    public LsResolveUtilSubsystemName: string;

    public LsResolveUtilRestrictionLevel: Object;
}
