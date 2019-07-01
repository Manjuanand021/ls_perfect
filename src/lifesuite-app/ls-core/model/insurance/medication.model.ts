import { BaseModel } from '../core/base.model';
import { DBDate } from '../util/dbdate';

export class MedicationModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.MedicationModel, LifeSuite';

    public MedicationId: number;

    public PolicyPersonId: Object;

    public Condition: string;

    public DrugName: string;

    public Points: Object;

    public IsSystemGenerated: string;

    public Override: string;

    public Added: Object;

    public Updated: Object;

    public AddedBy: number;

    public UpdatedBy: number;

    public Dosage: string;

    public AddonCondition: string;

    public DrugLabel: string;

    public DrugDosageForm: string;

    public DrugFilldate: DBDate;

    public DrugStrength: string;

    public PrescriberFirstName: string;

    public PrescriberLastName: string;

    public PrescriberCity: string;

    public PrescriberState: string;

    public PrescriberPhone: string;

    public Primary: boolean;
}
