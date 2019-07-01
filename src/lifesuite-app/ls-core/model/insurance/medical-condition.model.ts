import { BaseModel } from '../core/base.model';

export class MedicalConditionModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.MedicalConditionModel, LifeSuite';

    public BodilySystem: string;

    public Condition: string;

    public Criteria: string;

    // Added is not a DBDate object, but a .NET DateTime object
    public Added: Object;

    public AddedBy: Object;

    public Updated: Object;

    public UpdatedBy: number;

    public MedicalConditionId: Object;

    public Points: Object;

    public PolicyPersonId: Object;

    public TimeOfCriteria: string;

    public IsSystemGenerated: string;

    public Override: string;
}
