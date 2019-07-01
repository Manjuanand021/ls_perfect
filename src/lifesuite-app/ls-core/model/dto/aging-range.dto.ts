export class AgingRangeDTO {
    public $type: string = 'life.ls.ui.ria.dto.policyStatus.AgingRangeDTO, LifeSuite.UIServiceDTO';

    public rangeType: number;
    public fromAge: number;
    public toAge: number;
    public fromDate: Date;
    public toDate: Date;
    public numberOfPolicies: number;
    public rangeLabel: string;
}
