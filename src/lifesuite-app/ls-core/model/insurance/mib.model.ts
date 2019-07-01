import { DBDate } from '../util';
import { ProviderInformationModel } from '../common';

export class MIBModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.provider.mib.MIBModel, LifeSuite';

    public MibHeaderId: Object;

    public PolicyNumber: string;

    public BirthDate: DBDate;

    public PlaceOfBirth: string;

    public ApplicationPrefix: string;

    public ErrorMsgText: string;

    public RecType: string;

    public Csy: string;

    public Dcode: string;

    public BatchNumber: string;

    public InqNumber: string;

    public InqType: string;

    public ReplyType: string;

    public InquiryDate: DBDate;

    public ModifyDatetime: DBDate;

    public Occupation: string;

    public Gender: string;

    public FollowupUserId: Object;
}
