import { BaseModel } from '../core/base.model';

export class VelogicaDetailModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.velogica.VelogicaDetailModel, LifeSuite';

    public VelogicaHeaderId: Object;

    public SeqNumber: Object;

    public ReasonCode: string;

    public ReasonDescription: string;

    public CategoryCode: string;

    public ReasonSource: string;

    public EvidenceIncluded: string;
}
