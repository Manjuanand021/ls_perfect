import { BaseModel } from '../core';
import { DBDate } from '../util';

export class ScratchPadModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ScratchPadModel, LifeSuite';

    public ScratchPadId: Object;

    public PolicyId: Object;

    public ScratchPadNote: string;

    public AddedDate: DBDate;

    public AddedBy: Object;

    public UpdatedDate: DBDate;

    public UpdatedBy: Object;
}
