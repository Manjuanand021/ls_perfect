import { PartyModel } from '../common';

export class OwnerModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.OwnerModel, LifeSuite';
    public PolicyPersonId: object;
    public PolicyId: object;
    public RelationshipToInsured: string;
    public RoleId: string;
    public SubRoleId: string;
}

export const OwnerSubRoleTypes = {
    PRIMARY: 'primary',
    CONTINGENT: 'contingent',
    JOINT: 'joint'
};
