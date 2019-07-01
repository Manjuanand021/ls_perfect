import { TextFilterComponent } from './text-filter/text-filter.component';
import { NumericFilterComponent } from './numeric-filter/numeric-filter.component';
import { DateFilterComponent } from './date-filter/date-filter.component';

export const GridFilterFrameworkComponents = {
    textFilterComponent: TextFilterComponent as any,
    numericFilterComponent: NumericFilterComponent as any,
    dateFilterComponent: DateFilterComponent as any
};

export const GridFilterFrameworkComponentType = {
    TextFilter: 'textFilterComponent',
    NumericFilter: 'numericFilterComponent',
    DateFilter: 'dateFilterComponent'
};
