import { NumericFilterBuilder, NumericGridFilter } from 'life-core/component/grid';
import { NumericFilter } from 'ls-core/service';
import { IServerFilter } from 'life-core/service';

export class LsNumericFilterBuilder extends NumericFilterBuilder {
    protected getNumericFilter(
        fields: string[],
        numericGridFilter: NumericGridFilter,
        compareOp: string
    ): IServerFilter {
        return new NumericFilter(fields[0], numericGridFilter.filter, numericGridFilter.filterTo, compareOp);
    }
}
