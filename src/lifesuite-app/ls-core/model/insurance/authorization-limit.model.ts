import { BaseModel } from '../core';

export class AuthorizationLimitModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.AuthorizationLimitModel, LifeSuite';

    public UserId: Object;
    public LineOfBusinessCode: string;
    public AuthorizationMinimum: Object;
    public AuthorizationLimit: Object;
    public ApprovalLimit: Object;
}
