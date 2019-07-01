import { Identifiable } from './identifiable';
import { RoleModel } from 'ls-core/model/security/role.model';
import { PrivilegeDTO } from 'ls-core/model';

export class RoleDTO extends RoleModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.RoleDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Privileges_LazyLoad: Array<PrivilegeDTO>;
}
