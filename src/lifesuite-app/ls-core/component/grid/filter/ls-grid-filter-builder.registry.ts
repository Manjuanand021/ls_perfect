import { GridFilterBuilderRegistryType } from 'life-core/component/grid';
import { LsTextFilterBuilder } from './ls-text-filter.builder';
import { LsNumericFilterBuilder } from './ls-numeric-filter.builder';
import { LsDateFilterBuilder } from './ls-date-filter.builder';

export const LsGridFilterBuilderRegistry: GridFilterBuilderRegistryType = {
    text: LsTextFilterBuilder,
    number: LsNumericFilterBuilder,
    date: LsDateFilterBuilder
};
