import { PartyModel } from '../common';
import { DBDate } from '../util';

export class FamilyHistoryModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.FamilyHistoryModel, LifeSuite';

    public RequirementInformationId: Object;

    public FamilyHistoryId: Object;

    public FamhistRelationshipCode: string;

    public LivingStatus: string;

    public ReasonForDeath: string;

    public Age: Object;

    public CancerFlag: Object;

    public CancerAge: Object;

    public HeartDiseaseFlag: Object;

    public HeartDiseaseAge: Object;

    public OtherDiseaseFlag: Object;

    public OtherDiseaseAge: Object;

    public OtherDiseaseDesc: string;
}
