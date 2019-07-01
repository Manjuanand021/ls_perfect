import { BaseDTO } from '../dto/base.dto';
import { DBDate } from '../util';

export class RxRulesSummaryProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.RxRulesSummaryProxy, LifeSuite';

    public PrescriptionDrugRulesResultsId: Object;

    public PrescriptionDrugHeaderId: Object;

    public PolicyPersonId: Object;

    public AddedDate: DBDate;

    public RulesLevel: string;

    public RulesIdentifier: string;

    public RulesIndex: string;

    public OrderReference: string;

    public AlternateOrderReference: string;

    public OrderResultStatus: string;

    public OrderResultsUrl: string;

    public ImageExtractIndicator: Object;

    public ImageType: string;

    public ImageFileName: string;

    public ApplicantFirstName: string;

    public ApplicantLastName: string;

    public ApplicantBirthDate: string;

    public ApplicantGender: string;

    public ApplicantRelationship: string;

    public ApplicantResultStatus: string;

    public PrescriptionFillCount: Object;

    public MillimanAccount: string;
}
