import { BaseModel } from '../core';
import { DBDate } from '../util';

export class ReviewMessageModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ReviewMessageModel, LifeSuite';

    public ReviewMessageId: object;
    public NoteId: object;
    public PolicyId: object;
    public SequenceNumber: object;
    public MessageType: string;
    public Message: string;
    public OriginCode: string;
    public CheckoffFlag: number;
    public MessageNumber: object;
    public AddedDate: DBDate; // C01
    public CheckOffDate: DBDate; // C01
    public CheckedOffBy: object;
    public PolicyPersonId: object;
    public RuleName: string;
    public ReviewMessageComment: string;
    public AltMessage: string;
    public AltComment: string;
    public UserRoleType: string;
    public CrmLinkValue: object; // C04
}
