import { ProviderInformationModel } from '../common';
import { DBDate } from '../util';
import { DBDateCrypted } from '../util/dbdate-crypted';

export class EvidenceStatusModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.provider.EvidenceStatusModel, LifeSuite';

    public EvidenceStatusId: Object;

    public StatusId: string;

    public CodeSource: string;

    public Code: string;

    public MessageText: string;

    public StatusDate: DBDate;

    public FollowupDate: DBDate;
}
