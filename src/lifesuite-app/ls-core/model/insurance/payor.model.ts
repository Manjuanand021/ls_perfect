import { PartyModel } from '../common';

export class PayorModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.PayorModel, LifeSuite';
    public PolicyPersonId: object;
    public PolicyId: object;
    public RelationshipToInsured: string;
    public RoleId: string;
    public SubRoleId: string;
}

export const PayorSubRoleTypes = {
    PRIMARY: 'primary',
    CONTINGENT: 'contingent',
    JOINT: 'joint'
};
