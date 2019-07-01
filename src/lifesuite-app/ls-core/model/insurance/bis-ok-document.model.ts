import { BaseModel } from '../core';
import { DBDate } from '../util';

export class BisOkDocumentModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.BisOkDocumentModel, LifeSuite';

    public ApplicantName: string;

    public IsNew: string;

    public DocId: Object;

    public LastUpdateDate: DBDate;

    public PolicyNumber: string;
}
