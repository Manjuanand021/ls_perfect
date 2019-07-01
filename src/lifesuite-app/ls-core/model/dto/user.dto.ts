import { Identifiable } from './identifiable';
import { UserModel } from '../security/user.model';
import { AddressDTO, PartyRelationDTO, PhoneDTO, UserTeamProxyDTO, AuthorizationLimitDTO } from './index';
import { RoleDTO } from 'ls-core/model/dto/role.dto';

export class UserDTO extends UserModel {
    public static Type: string = 'life.ls.ui.ria.dto.UserDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = UserDTO.Type;

    public identifier: Identifiable;

    public AuthorizationLimits_LazyLoad: Array<AuthorizationLimitDTO>;
    public RecentFiles_LazyLoad: Array<any>;
    public Roles_LazyLoad: Array<RoleDTO>;
    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;

    public daysUntilPasswordExpires: number;

    // This property represents the number of the days the current user password is valid
    public getPromptForPasswordChange: number;

    // public getOutOfOffice: boolean;

    // public IsOOFMsgAppr: boolean;

    public UserTeams: Array<UserTeamProxyDTO>; // UserTeamProxyDTO?

    public Privileges: Array<any>; // PrivilegeProxy?

    public SessionTimeout: number;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
