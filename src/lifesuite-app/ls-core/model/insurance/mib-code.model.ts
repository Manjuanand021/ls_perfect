import { BaseModel } from '../core/base.model';
import { DBDate } from '../util/dbdate';

export class MIBCodeModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.mib.MIBCodeModel, LifeSuite';

    public MibHeaderId: Object;

    public SeqNumber: Object;

    public FieldId: string;

    public DataItem: string;

    public DateReported: DBDate;

    public ReportedBy: string;
}
