import { BaseModel } from '../core';
import { DBDate } from '../util';

export class BenefitModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.BenefitModel, LifeSuite';

    public BenefitId: Object;

    public SequenceNo: Object;

    public Description: string;

    public Amount: Object;

    public CoverageStatus: string;

    public ReasonText: string;

    public PolicyCoverageId: Object;

    public ApprovedDifferentAmountFlag: Object;

    public ApprovedAmount: Object;

    public Note: string;

    public TempTableRating: string;

    public TempTableReason: string;

    public PermTableRating: string;

    public PermTableReason: string;

    public FlatExtraReason: string;

    public PermFlatExtraAmount: Object;

    public TempFlatExtraAmount: Object;

    public TempFlatExtraPeriod: Object;

    public IssuedTimesStandard: Object;

    public BenefitDuration: Object;

    public ReinsuranceFlag: Object;
}
