import { IServerFilter } from 'life-core/service';
import { DateFilterBuilder, DateGridFilter } from 'life-core/component/grid';
import { DateFilter } from 'ls-core/service';

export class LsDateFilterBuilder extends DateFilterBuilder {
    protected getDateFilter(fields: string[], dateGridFilter: DateGridFilter, compareOp: string): IServerFilter {
        return new DateFilter(fields[0], dateGridFilter.dateFrom, dateGridFilter.dateTo, compareOp);
    }
}
