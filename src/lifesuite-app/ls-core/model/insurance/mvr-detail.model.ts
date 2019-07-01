import { BaseModel } from '../core/base.model';
import { DBDate } from '../util/dbdate';

export class MVRDetailModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.MVRDetailModel, LifeSuite';

    public MvrHeaderId: Object;

    public SeqNumber: Object;

    public RecordType: string;

    public Data: string;

    public ModifyDatetime: DBDate;

    public ViolationType: string;

    public ViolationDate: DBDate;

    public ConvictionDate: DBDate;

    public ViolationCode: string;

    public Points: string;

    public AssignedViolationCode: string;

    public AssignedPoints: string;

    public ViolationDetail: string;
}
