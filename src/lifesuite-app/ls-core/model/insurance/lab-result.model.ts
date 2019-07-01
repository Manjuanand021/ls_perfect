import { BaseModel } from '../core/base.model';

export class LabResultModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.lab.LabResultModel, LifeSuite';

    public LabIdNumber: String;

    public RequirementInformationId: Object;

    public HorlCode: String;

    public Indicator: String;

    public ResultValue: String;

    public HighLow: String;

    public SequenceNumber: Object;

    public RangeText: String;
}
