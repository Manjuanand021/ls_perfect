import { PartyModel } from '../common';
import { DBDate } from '../util';

export class UserModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.security.UserModel, LifeSuite';

    public UserId: Object;

    public LoginId: string;

    public Password: string;

    public IsActive: Object;

    public LevelOfAuthority: Object;

    public IsUnderwriter: Object;

    public RestrictToTeams: Object;

    public RoleId: Object;

    public IsServiceAssociate: Object;

    public JobTitle: string;

    public AccountLocked: Object;

    public AccountLockedDate: DBDate;

    public BadLoginAttemptCount: Object;

    public LastBadLoginAttemptDate: DBDate;

    public MustChangePassword: Object;

    public LastPasswordChangeDate: DBDate;

    public IsAgent: Object;

    public AgentNumber: string;

    public IsAgency: Object;

    public AgencyNumber: string;

    public Deleted: Object;

    public UseSingleSignOn: Object;

    public LoadBalancingFactor: Object;

    public RecoverPassAttemptCount: Object;

    public LastRecoverPassAttemptDate: DBDate;

    public OutOfOffice: Object;

    public LastLoginDate: DBDate;

    public ExcludeFromDropdown: Object;
}
