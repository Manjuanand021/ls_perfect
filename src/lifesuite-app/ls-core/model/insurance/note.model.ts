import { DBDate } from '../util';
import { BaseModel } from '../core';

export class NoteModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.NoteModel, LifeSuite';

    public NoteId: Object;

    public Author: Object;

    public NoteType: string;

    public Topic: string;

    public Visibility: string;

    public AddedDate: DBDate;

    public UpdateDate: DBDate;

    public DiaryDate: DBDate;

    public Note: string;

    public PolicyPersonId: Object;

    public ReferToUserId: Object;

    public UpdatedBy: Object;

    public EmailToList: string;

    public ReviewedBy: Object;

    public ReviewedDate: DBDate;

    public AltTopic: string;

    public AltNote: string;

    public ParentNoteId: Object;

    public PrimaryAuthor: Object;
}
