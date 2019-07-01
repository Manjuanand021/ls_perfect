import { PartyModel } from '../common';

export class PartyRelationModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.PartyRelationModel, LifeSuite';
    public ParentId: object;
}
