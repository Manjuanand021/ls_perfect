import { BaseModel } from '../core';
import { DBDate } from '../util';

export class ReferralProxyModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ReferralProxy, LifeSuite';

    public InsuredNameFull: string;

    public InsuredName: string;

    public AuthorLastName: string;

    public AuthorFirstName: string;

    public ReferredToLastName: string;

    public ReferredToFirstName: string;

    public AuthorName: string;

    public ReferredToName: string;

    public db_Name: string;

    public NoteId: Object;

    public DiaryDate: DBDate;

    public PolicyId: Object;

    public PolicyNumber: string;

    public InsuredTitle: string;

    public InsuredLastName: string;

    public InsuredMiddleName: string;

    public InsuredFirstName: string;

    public InsuredSuffix: string;

    public AuthorId: Object;

    public AuthorLoginId: string;

    public ReferredToId: Object;

    public ReferredToLoginId: string;

    public Topic: string;

    public TeamId: Object;

    public UnderwriterId: Object;

    public PastDue: boolean;
}
