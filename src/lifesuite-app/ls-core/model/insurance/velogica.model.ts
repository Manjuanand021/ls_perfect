import { DBDate } from 'ls-core/model';
import { ProviderInformationModel } from '../common/provider-information.model';

export class VelogicaModel extends ProviderInformationModel {
    public readonly $type: string = 'vpi.aus.provider.velogica.VelogicaModel, LifeSuite';
    public VelogicaHeaderId: Object;

    public PolicyNumber: string;

    public PolicyPersonId: Object;

    public PolicyCoverageId: Object;

    public StatusResponse: string;

    public StatusDate: DBDate;

    public Decision: string;

    public SmokerClass: string;

    public UnderwritingClass: string;

    public EvidenceIncluded: string;
}
