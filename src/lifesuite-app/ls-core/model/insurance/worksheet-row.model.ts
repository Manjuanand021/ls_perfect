import { BaseModel } from '../core';
import { DBDate } from '../util';

export class WorksheetRowModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ReinsurerModel, LifeSuite';

    public CoveragePersonWorksheetId: Object;

    public CoveragePersonId: Object;

    public Priority: Object;

    public RiskFactor: string;

    public Result: string;

    public RateClass: string;

    public Note: string;

    public Debit: Object;

    public PermFlatExtraAmount: Object;

    public TempFlatExtraAmount: Object;

    public TempFlatExtraPeriod: Object;

    public TableRating: string;

    public OriginCode: string;

    public AddedDate: DBDate;

    public AddedBy: Object;

    public AltNote: string;
}
