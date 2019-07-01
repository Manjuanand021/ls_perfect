import { PolicyDTO, UserTeamProxyDTO, PrivilegeDTO, UserDTO } from 'ls-core/model';
import { AuthorizationLevel, IAuthorizationFinder } from 'life-core/authorization';
import { RestrictionLevel } from './restriction-level';
import { ConvertUtil } from 'life-core/util/lang';

export class PolicyAuthorizationFinder implements IAuthorizationFinder {
    private _user: UserDTO;

    constructor(user: UserDTO) {
        this._user = user;
    }

    public getObjectAuthorizationLevel(
        subsystem: string,
        object: Object,
        privilegeToCheck: string
    ): AuthorizationLevel {
        return this.getPolicyAuthorizationLevel(subsystem, object as PolicyDTO, privilegeToCheck);
    }

    /**
     * Get authorization level for a one policy privilege
     *
     * @param subsystem - value of SubsystemType
     * @param privilegeToCheck - privilege name
     * @param policy - policy object for checking restriction level
     * @return privilege level value (of authorizationLevel type)
     *
     */
    private getPolicyAuthorizationLevel(
        subsystem: string,
        policy: PolicyDTO,
        privilegeToCheck: string
    ): AuthorizationLevel {
        const privileges = this._user.Privileges;
        let authorizationLevel = AuthorizationLevel.NONE;

        const privilege = privileges.find(privilege => {
            return privilege.SubsystemName == subsystem && privilege.Name == privilegeToCheck;
        });
        if (privilege) {
            switch (this.getRestrictionLevel(privilege)) {
                case RestrictionLevel.NONE:
                    // no restriction level so authorized
                    authorizationLevel = privilege.All;
                    break;
                case RestrictionLevel.TEAM:
                    if (policy) {
                        // authorized if user is member of policy assigned team
                        authorizationLevel = this.checkTeam(policy) ? privilege.Team : privilege.All;
                    } else {
                        authorizationLevel = AuthorizationLevel.NONE;
                    }
                    break;
                case RestrictionLevel.ASSIGNED:
                    if (policy) {
                        // authorized if user is assigned to policy
                        authorizationLevel = this.checkAssigned(policy) ? privilege.Assigned : privilege.All;
                    } else {
                        authorizationLevel = AuthorizationLevel.NONE;
                    }
                    break;
                default:
                    authorizationLevel = AuthorizationLevel.NONE;
            }
        }
        return authorizationLevel;
    }

    private checkAssigned(policy: PolicyDTO): boolean {
        const userId = ConvertUtil.toNumber(this._user.UserId);
        if (policy.UnderwriterId && userId == ConvertUtil.toNumber(policy.UnderwriterId)) {
            return true;
        }

        if (policy.ServiceAssociateId && userId == ConvertUtil.toNumber(policy.ServiceAssociateId)) {
            return true;
        }
        return false;
    }

    private checkTeam(policy: PolicyDTO): boolean {
        if (policy.TeamId && this.isAssignedToTeam(policy.TeamId)) {
            return true;
        }
        return false;
    }

    private isAssignedToTeam(teamId: Object): boolean {
        const userTeam = this.getUserTeamById(teamId);

        if (userTeam) {
            // found but only active teams count
            if (userTeam.IsActive) {
                // userTeam.getIsActive()
                return true;
            } else {
                return false;
            }
        } else {
            return false; // not found so not assigned
        }
    }

    private getUserTeamById(teamId: Object): UserTeamProxyDTO {
        if (teamId == null) {
            return null;
        }
        const teams = this._user.UserTeams;
        return teams.find(assignedTeam => {
            return ConvertUtil.toNumber(teamId) == ConvertUtil.toNumber(assignedTeam.TeamId);
        });
    }

    private getRestrictionLevel(privilege: PrivilegeDTO): number {
        let restrictionLevel = RestrictionLevel.NONE;
        if (privilege.All > AuthorizationLevel.NONE) {
            restrictionLevel = RestrictionLevel.NONE;
        }
        if (privilege.Assigned > restrictionLevel) {
            restrictionLevel = RestrictionLevel.ASSIGNED;
        }
        if (privilege.Team > restrictionLevel) {
            restrictionLevel = RestrictionLevel.TEAM;
        }
        if (privilege.AssignedOrTeam > restrictionLevel) {
            restrictionLevel = RestrictionLevel.ASSIGNED_OR_TEAM;
        }
        if (privilege.Unassigned > restrictionLevel) {
            restrictionLevel = RestrictionLevel.UNASSIGNED;
        }
        return restrictionLevel;
    }
}
