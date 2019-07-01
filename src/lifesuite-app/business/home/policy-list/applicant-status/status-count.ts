import { PolicyAgingRangeType } from '../policy-status-type';
import { AgingRangeDTO } from 'ls-core/model';

export class StatusCount {
    public statusType: number;
    public nameKey: string;
    public agingRanges: Array<AgingRangeDTO>;
    public selectedRange: number;

    constructor(statusType: number, agingRanges: Array<AgingRangeDTO>, nameKey: string) {
        this.statusType = statusType;
        this.nameKey = nameKey;
        this.agingRanges = agingRanges;
        this.selectedRange = PolicyAgingRangeType.Total;
    }
}
