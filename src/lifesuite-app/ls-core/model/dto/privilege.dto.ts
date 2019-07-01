import { PrivilegeModel } from '../security/privilege.model';
import { IIdentifiable, Identifiable } from './identifiable';

export class PrivilegeDTO extends PrivilegeModel {
    public $type: string = 'life.ls.ui.ria.dto.PrivilegeDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public Assigned: number;

    public Team: number;

    public All: number;

    public AssignedOrTeam: number;

    public Unassigned: number;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
