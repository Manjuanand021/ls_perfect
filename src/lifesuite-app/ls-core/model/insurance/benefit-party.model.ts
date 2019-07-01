import { BaseModel } from '../core';
import { PartyModel } from '../common';

export class BenefitPartyModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.BenefitPartyModel, LifeSuite';

    public BenefitId: Object;

    public PolicyCoverageId: Object;

    public RelationshipToInsuredCode: string;

    public HeightInches: Object;

    public WeightPounds: Object;
}
