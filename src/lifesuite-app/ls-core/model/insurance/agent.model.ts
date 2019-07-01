import { PartyModel } from '../common';

export class AgentModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.AgentModel, LifeSuite';

    public PolicyPersonId: object;

    public AgencyId: object;

    public CommissionSplit: object;

    public CommissionOption: string;

    public MarketCode: string;

    public AgentNumber: string;

    public PolicyId: object;

    public RoleId: string;

    public SubRoleId: string;

    public RoutingNumber: string;

    public FirmName: string;

    public Level5Code: string;

    public CompanyCode: string;

    public Descriptor: string;

    public ProducerType: string;

    public CommissionPct: string;
}
