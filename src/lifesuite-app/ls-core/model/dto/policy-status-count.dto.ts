import { AgingRangeDTO } from 'ls-core/model';

export class PolicyStatusCountDTO {
    public $type: string = 'life.ls.ui.ria.dto.policyStatus.PolicyStatusCountDTO, LifeSuite.UIServiceDTO';

    public statusCountType: number;
    public agingRanges: Array<AgingRangeDTO>;
}
