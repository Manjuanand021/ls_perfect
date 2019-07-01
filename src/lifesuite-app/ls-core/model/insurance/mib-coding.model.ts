import { DBDate } from '../util';
import { BaseModel } from '../core';

export class MIBCodingModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.mib.MibCodingModel, LifeSuite';

    public PolicyPersonId: Object;

    public SequenceNumber: Object;

    public MibCodes: string;

    public DateAdded: DBDate;

    public DateSent: DBDate;

    public AddedBy: Object;

    public EffectiveDate: DBDate;

    public MibValidationResult: Object;

    public MibTranslationResult: Object;

    public RxRuleGenerated: Object;

    public SubmittedStatus: Object;
}
