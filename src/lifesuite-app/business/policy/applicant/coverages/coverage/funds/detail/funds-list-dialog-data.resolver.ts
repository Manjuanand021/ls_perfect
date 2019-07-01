import { DirectResolve } from 'life-core/view-model/data-resolver';
import { ListMap } from 'life-core/model';

import { ListDataItem } from 'ls-core/service';

export class FundsListDialogDataResolver implements DirectResolve<ListMap<ListDataItem>> {
    public context: any;

    constructor() {}

    public directResolve(): ListMap<ListDataItem> {
        return this.context.fundCodes.filter(this.isNonExistingFundPredicate.bind(this));
    }

    /**
     * filters only funds which do not exist in fundsList or is an active fund
     * @param item - each item in FundCodes
     */
    private isNonExistingFundPredicate(item: ListDataItem): boolean {
        return (
            this.context.activeFund.FundCode === item.Id ||
            !this.context.fundList.find(fund => fund.FundCode === item.Id)
        );
    }
}
