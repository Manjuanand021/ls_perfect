import { PolicyAgingRangeType } from '../policy-status-type';
import { AgingRangeDTO } from 'ls-core/model';

export class PolicyAgingRangeUtil {
    public static getAgingRangeLabel(agingRange: AgingRangeDTO): string {
        let label = '';

        switch (agingRange.rangeType) {
            case PolicyAgingRangeType.Total:
                label = 'Total';
                break;
            case PolicyAgingRangeType.Lower:
                label = `within  ${(agingRange.toAge + 1).toString()} days`;
                break;
            case PolicyAgingRangeType.Highest:
                label = `over ${agingRange.fromAge - 1} days`;
                break;
            default:
                label = `${agingRange.fromAge} - ${agingRange.toAge} days`;
                break;
        }
        return label;
    }

    public static getAgingRangeAndCountLabel(agingRange: AgingRangeDTO): string {
        return `${this.getAgingRangeLabel(agingRange)}: ${agingRange.numberOfPolicies}`;
    }

    // Returns aging range for range type*
    public static getAgingRangeByType(list: AgingRangeDTO[], rangeType: number): AgingRangeDTO {
        return list.find(item => item.rangeType == rangeType);
    }
}
