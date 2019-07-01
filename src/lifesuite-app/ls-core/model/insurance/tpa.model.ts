import { BaseModel } from '../core';
import { DBDate } from '../util';

export class TPAModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.core.TPAModel, LifeSuite';

    public TpaCode: String;

    public TpaShortName: String;

    public ContactLastName: String;

    public ContactFirstName: String;

    public AutoClosureDays: Object;

    public ExpirationDate: DBDate;
}
