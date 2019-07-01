import { PartyModel } from '../common';

export class BeneficiaryModel extends PartyModel {
    public readonly $type: string = 'vpi.aus.insurance.core.BeneficiaryModel, LifeSuite';

    public PolicyCoverageId: Object;

    public RoleId: Object;

    public RelationshipToInsuredCode: string;

    public CoveragePersonId: Object;

    public BeneficiaryType: string;

    public Percentage: Object;

    public Amount: Object;

    public IrrevokableIndicator: Object;

    public Age: Object;

    public BenefitType: string;
}
