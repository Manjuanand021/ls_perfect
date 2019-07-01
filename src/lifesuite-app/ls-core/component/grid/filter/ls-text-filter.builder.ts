import { TextFilterBuilder, TextGridFilter } from 'life-core/component/grid';
import { IServerFilter } from 'life-core/service';
import { SimpleTextFilter, CompositeTextFilter } from 'ls-core/service';

export class LsTextFilterBuilder extends TextFilterBuilder {
    protected buildSimpleFilter(field: string, gridFilter: TextGridFilter, compareOp: string): IServerFilter {
        return new SimpleTextFilter(field, gridFilter.filter, compareOp);
    }

    protected buildCompositeFilter(fields: string[], gridFilter: TextGridFilter): IServerFilter {
        const compositeTextFilter = new CompositeTextFilter();
        compositeTextFilter.fields = fields;
        compositeTextFilter.filters = gridFilter.filter.split(FILTER_WORD_DELIMITER);
        return compositeTextFilter;
    }
}

export const FILTER_WORD_DELIMITER = ' ';
