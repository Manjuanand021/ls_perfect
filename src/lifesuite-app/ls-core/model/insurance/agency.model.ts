import { PartyModel } from '../common';
import { DBDate } from '../util';

export class AgencyModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.core.AgencyModel, LifeSuite';

    public AgencyNumber: String;

    public RoutingNumber: String;

    public UpdateDate: DBDate;

    public PolicyPersonId: Object;

    public PolicyId: Object;

    public RoleId: String;

    public SubRoleId: String;
}
