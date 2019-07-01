import { AgingRangeDTO } from 'ls-core/model';
import { PolicyAgingRangeUtil } from './policy-aging-range.util';
import { MenuItem } from 'life-core/component/menu';
import { SplitButtonMenuClickEvent } from 'life-core/component/button';

export class ApplicantStatusListBuilder {
    public static buildApplicantStatusList(
        agingRanges: Array<AgingRangeDTO>,
        onStatusAgingRangeChange: (event: SplitButtonMenuClickEvent) => void
    ): Array<MenuItem> {
        const statusList: Array<MenuItem> = [];

        agingRanges.forEach(agingRange => {
            const label = PolicyAgingRangeUtil.getAgingRangeAndCountLabel(agingRange);
            const menuItem = new MenuItem({
                id: agingRange.rangeType.toString(),
                label: label,
                command: onStatusAgingRangeChange
            });
            statusList.push(menuItem);
        });

        return statusList;
    }
}
