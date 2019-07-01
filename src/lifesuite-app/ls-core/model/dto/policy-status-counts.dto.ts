import { PolicyStatusCountDTO } from './policy-status-count.dto';

export class PolicyStatusCountsDTO {
    public $type: string = 'life.ls.ui.ria.dto.policyStatus.PolicyStatusCountsDTO, LifeSuite.UIServiceDTO';

    public statusTypeCounts: Array<PolicyStatusCountDTO>;
}
