import { BaseModel } from '../core/base.model';

export class LabCommentModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.lab.LabCommentModel, LifeSuite';

    public LabIdNumber: string;

    public RequirementInformationId: Object;

    public RemarkId: string;

    public SequenceNo: Object;

    public CommentText: string;
}
