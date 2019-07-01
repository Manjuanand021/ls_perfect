import { InjectionToken } from '@angular/core';

import { GridFilterBuilderRegistryType } from './filter-builder.type';

export const GRID_FILTER_BUILDER_REGISTRY = new InjectionToken<GridFilterBuilderRegistryType>(
    'grid.filter.builder.registry'
);
